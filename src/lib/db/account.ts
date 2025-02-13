import clientPromise from '@/lib/mongoClient'
import { Collection, Db, MongoClient, ObjectId } from 'mongodb'
import Account from '@/types/account'

const dbName = process.env.MONGO_DATABASE_NAME
const Accounts_DB_NAME = process.env.MONGO_COLLECTION_ACCOUNTS as string

let client: MongoClient | null = null
let db: Db | null = null
let A: Collection

async function init() {
  if (db) return
  try {
    client = await clientPromise
    db = client.db(dbName)
    A = db.collection(Accounts_DB_NAME)
  } catch (error) {
    console.log(error)

    throw new Error('Failed to connect to database')
  }
}

export async function createAccount({
  credentials,
  owner,
  createdBy,
  name,
  status,
  asUser = false,
}: {
  credentials: any
  owner: string
  name: string
  status: string
  createdBy: string
  asUser: boolean
}): Promise<{
  ok?: boolean
  id?: string
  error?: string
}> {
  try {
    if (!db) await init()
    const result = await A.insertOne({
      credentials,
      owner,
      status,
      name,
      createdBy,
      last_fetch_campaigns: '2010-01-01',
      last_fetch_customers: '2010-01-01',
      asUser,
    })

    if (!result.acknowledged) {
      return {
        error: 'Failed to create account',
      }
    }

    return {
      ok: true,
      id: result.insertedId.toString(),
    }
  } catch (error) {
    return {
      error: 'Failed to create account',
    }
  }
}

export async function getAccountWithCampaigns({
  account_id = '',
}: {
  account_id: string
}): Promise<{ account?: any; error?: string }> {
  try {
    if (!db) await init()

    let query = { status: { $nin: ['deleted', 'inactive'] } } as any

    if (account_id !== '') {
      query['_id'] = new ObjectId(account_id)
    }

    const account = await A.aggregate([
      // Étape 1 : Filtrer l'account par `account_id`
      {
        $match: query,
      },
      // Étape 2 : Projeter uniquement les champs nécessaires de l'account
      {
        $project: {
          id: { $toString: '$_id' },
          name: 1,
          createdBy: 1,
          owner: 1,
        },
      },
      // Étape 3 : Lookup pour récupérer les campagnes liées à l'account
      {
        $lookup: {
          from: 'Campaigns', // Nom de la collection des campagnes
          let: { accountId: '$id' },
          pipeline: [
            { $match: { $expr: { $eq: ['$account_id', '$$accountId'] } } },
            { $project: { campaign_id: 1, campaign_name: '$data.campaignName' } }, // Limiter les champs retournés
          ],
          as: 'campaigns',
        },
      },
      // Étape 4 : Pour chaque campagne, récupérer uniquement les produits liés
      {
        $unwind: {
          path: '$campaigns',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'Products', // Nom de la collection des produits
          let: { campaignId: '$campaigns.campaign_id' },
          pipeline: [
            { $match: { $expr: { $eq: ['$campaign_id', '$$campaignId'] } } },
            { $match: { $expr: { $ne: ['$data.product_id', null] } } }, // Filtrer les produits sans nom
            {
              $project: {
                product_id: '$data.productId',
                product_name: '$data.productName',
                _id: 0,
              },
            }, // Limiter les champs retournés
          ],
          as: 'campaigns.products',
        },
      },
      // Re-structurer les données après le second lookup
      {
        $group: {
          _id: '$id',
          name: { $first: '$name' },
          createdBy: { $first: '$createdBy' },
          owner: { $first: '$owner' },
          asUser: { $first: '$asUser' },
          campaigns: {
            $push: {
              campaign_id: '$campaigns.campaign_id',
              campaign_name: '$campaigns.campaign_name',
              products: '$campaigns.products',
            },
          },
        },
      },
      // Étape 5 : Reformater la sortie pour correspondre au type attendu
      {
        $project: {
          id: { $toString: '$_id' },
          name: 1,
          createdBy: 1,
          owner: 1,
          asUser: 1,
          campaigns: {
            $filter: {
              input: '$campaigns',
              as: 'campaign',
              cond: { $ne: ['$$campaign.campaign_id', null] },
            },
          },
        },
      },
    ]).toArray()

    if (!account || account.length === 0)
      return {
        error: 'No account found',
      }

    return {
      account: {
        id: account[0].id,
        name: account[0].name,
        campaigns: account[0].campaigns,
        createdBy: account[0].createdBy,
        owner: account[0].owner,
        asUser: account[0].asUser,
      },
    }
  } catch (error) {
    console.log('sdhdfhdfhdf', error)

    return {
      error: 'Error',
    }
  }
}

export async function getAccountCreatedBy({ createdBy }: { createdBy: string }): Promise<{
  accounts?: Account[]
  error?: string
}> {
  try {
    if (!db) await init()
    const accounts = await A.find({ createdBy }).toArray()
    return {
      accounts: accounts.map((account) => ({
        id: account._id.toString(),
        credentials: account.credentials,
        asUser: account.asUser,
        owner: account.owner,
        status: account.status,
        name: account.name,
        createdBy: account.createdBy,
        last_fetch_campaigns: account.last_fetch_campaigns,
        last_fetch_customers: account.last_fetch_customers,
      })),
    }
  } catch (error) {
    return {
      error: 'Error',
    }
  }
}

export async function getUserAccounts({ username }: { username: string }): Promise<{
  accounts?: Account[]
  error?: string
}> {
  try {
    if (!db) await init()
    const accounts = await A.find({ owner: username }).toArray()
    return {
      accounts: accounts.map((account) => ({
        id: account._id.toString(),
        credentials: account.credentials,
        asUser: account.asUser,
        owner: account.owner,
        status: account.status,
        name: account.name,
        createdBy: account.createdBy,
        last_fetch_campaigns: account.last_fetch_campaigns,
        last_fetch_customers: account.last_fetch_customers,
      })),
    }
  } catch (error) {
    return {
      error: 'Error',
    }
  }
}

export async function updateAccount({
  account_id,
  credentials,
  name,
  asUser,
}: {
  account_id: string
  credentials: any
  name: string
  asUser: boolean
}): Promise<{
  ok?: boolean
  id?: string
  error?: string
}> {
  try {
    if (!db) await init()
    const result = await A.updateOne(
      { _id: new ObjectId(account_id) },
      { $set: { credentials, name, asUser } }
    )
    if (result.modifiedCount === 0)
      return {
        error: 'No account found',
      }
    return {
      ok: true,
      id: account_id,
    }
  } catch (error) {
    return {
      error: 'Failed to update account',
    }
  }
}

export async function deleteAccount({ account_id }: { account_id: string }): Promise<{
  ok?: boolean
  error?: string
}> {
  try {
    if (!db) await init()
    const result = await A.deleteOne({ _id: new ObjectId(account_id) })
    if (result.deletedCount === 0)
      return {
        error: 'No account found',
      }
    return {
      ok: true,
    }
  } catch (error) {
    return {
      error: 'Failed to delete account',
    }
  }
}

export async function getChildAccounts({ owner }: { owner: string }): Promise<{
  accounts?: Array<Account>
  error?: string
}> {
  try {
    if (!db) await init()
    const accounts = await A.find({ createdBy: owner }).toArray()
    return {
      accounts: accounts.map((account) => ({
        id: account._id.toString(),
        credentials: account.credentials,
        asUser: account.asUser,
        owner: account.owner,
        status: account.status,
        name: account.name,
        createdBy: account.createdBy,
        last_fetch_campaigns: account.last_fetch_campaigns,
        last_fetch_customers: account.last_fetch_customers,
      })),
    }
  } catch (error) {
    return {
      error: 'Error',
    }
  }
}

export async function getAccounts({ owner }: { owner: string }): Promise<{
  accounts?: Array<Account>
  error?: string
}> {
  try {
    if (!db) await init()

    // accounts with owner or createdBy matching the owner
    const accounts = await A.find({
      $or: [{ owner }, { createdBy: owner }],
      status: { $nin: ['deleted', 'inactive'] },
    }).toArray()

    if (!accounts)
      return {
        error: 'No accounts found',
      }
    return {
      accounts: accounts.map((account) => ({
        id: account._id.toString(),
        credentials: account.credentials,
        owner: account.owner,
        status: account.status,
        name: account.name,
        asUser: account.asUser,
        createdBy: account.createdBy,
        last_fetch_campaigns: account.last_fetch_campaigns,
        last_fetch_customers: account.last_fetch_customers,
      })),
    }
  } catch (error) {
    return {
      error: 'Error',
    }
  }
}

export async function updateAccountStatus({
  account_id,
  status,
}: {
  account_id: string
  status: 'active' | 'inactive' | 'deleted' | 'pending'
}): Promise<{
  ok?: boolean
  error?: string
}> {
  try {
    if (!db) await init()
    const result = await A.updateOne(
      { _id: new ObjectId(account_id) },
      { $set: { status } }
    )
    if (result.modifiedCount === 0)
      return {
        error: 'No account found',
      }
    return {
      ok: true,
    }
  } catch (error) {
    return {
      error: 'Failed to update account status',
    }
  }
}

export async function getAllAccounts(): Promise<{
  accounts?: Account[]
  error?: string
}> {
  try {
    if (!db) await init()
    const accounts = await A.find({}).toArray()
    return {
      accounts: accounts.map((account) => ({
        id: account._id.toString(),
        credentials: account.credentials,
        owner: account.owner,
        status: account.status,
        name: account.name,
        createdBy: account.createdBy,
        asUser: account.asUser,
        last_fetch_campaigns: account.last_fetch_campaigns,
        last_fetch_customers: account.last_fetch_customers,
      })),
    }
  } catch (error) {
    return {
      error: 'Error',
    }
  }
}

export async function getAccountByNames({ name }: { name: string }): Promise<{
  accounts?: Account[]
  error?: string
}> {
  try {
    if (!db) await init()
    const accounts = await A.find({
      name,
      status: { $nin: ['deleted', 'inactive'] },
    }).toArray()
    return {
      accounts: accounts.map((account) => ({
        id: account._id.toString(),
        credentials: account.credentials,
        owner: account.owner,
        status: account.status,
        name: account.name,
        createdBy: account.createdBy,
        asUser: account.asUser,
        last_fetch_campaigns: account.last_fetch_campaigns,
        last_fetch_customers: account.last_fetch_customers,
      })),
    }
  } catch (error) {
    return {
      error: 'Error',
    }
  }
}

export async function getAccountAdmin({
  account_id,
}: {
  account_id: string
}): Promise<{ account?: Account; error?: string }> {
  try {
    if (!db) await init()
    const account = await A.findOne({
      _id: new ObjectId(account_id),
    })

    if (!account)
      return {
        error: 'No account found',
      }
    return {
      account: {
        id: account._id.toString(),
        owner: account.owner,
        status: account.status,
        name: account.name,
        createdBy: account.createdBy,
      },
    }
  } catch (error) {
    return {
      error: 'Error',
    }
  }
}
export async function getAccount({
  account_id,
}: {
  account_id: string
}): Promise<{ account?: Account; error?: string }> {
  try {
    if (!db) await init()
    const account = await A.findOne({
      _id: new ObjectId(account_id),
      status: { $nin: ['deleted', 'inactive'] },
    })

    if (!account)
      return {
        error: 'No account found',
      }
    return {
      account: {
        id: account._id.toString(),
        owner: account.owner,
        status: account.status,
        name: account.name,
        createdBy: account.createdBy,
      },
    }
  } catch (error) {
    return {
      error: 'Error',
    }
  }
}

export async function deleteAllAccounts(): Promise<{
  accounts?: Account[]
  error?: string
}> {
  try {
    if (!db) await init()
    const result = await A.deleteMany({})
    return {
      accounts: result.deletedCount > 0 ? [] : undefined,
    }
  } catch (error) {
    return {
      error: 'Failed to delete accounts',
    }
  }
}
