const majorAlpha = 'ABCDEFGHJKMNPQRSTUVWXYZ' // without I, O, L
const minorAlpha = 'abcdefghjkmnpqrstuvwxyz' // without i, o, l
const numbers = '23456789' // without 0, 1
const symbols = '!@#$%&'

const minimal = {
  majorAlpha: 1,
  minorAlpha: 1,
  numbers: 2,
  symbols: 1,
}

export function generatePassword(length = 10): string {
  const password = []

  const { majorAlpha: ma, minorAlpha: mi, numbers: n, symbols: s } = minimal

  for (let i = 0; i < ma; i++) {
    password.push(majorAlpha[Math.floor(Math.random() * majorAlpha.length)])
  }

  for (let i = 0; i < mi; i++) {
    password.push(minorAlpha[Math.floor(Math.random() * minorAlpha.length)])
  }

  for (let i = 0; i < n; i++) {
    password.push(numbers[Math.floor(Math.random() * numbers.length)])
  }

  for (let i = 0; i < s; i++) {
    password.push(symbols[Math.floor(Math.random() * symbols.length)])
  }

  for (let i = password.length; i < length; i++) {
    const type = Math.floor(Math.random() * 4)
    switch (type) {
      case 0:
        password.push(majorAlpha[Math.floor(Math.random() * majorAlpha.length)])
        break
      case 1:
        password.push(minorAlpha[Math.floor(Math.random() * minorAlpha.length)])
        break
      case 2:
        password.push(numbers[Math.floor(Math.random() * numbers.length)])
        break
      case 3:
        password.push(symbols[Math.floor(Math.random() * symbols.length)])
        break
    }
  }

  return password.sort(() => Math.random() - 0.5).join('')
}
