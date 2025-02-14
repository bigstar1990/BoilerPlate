'use client'

import React, { useEffect, useState, useCallback, useMemo } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/shadcn/dialog'
import { Input } from '@/components/shadcn/input'
import { Button } from '@/components/shadcn/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/shadcn/form'
import { useForm, useWatch, FormProvider } from 'react-hook-form'
import { Switch } from '@/components/shadcn/switch'
import BetterSelect from '@/components/ui/data-filter/betterSelect'
import { DatePicker } from '@/components/shadcn/datePicker'
import { ScrollArea } from '@/components/shadcn/scroll-area'

export interface FieldConfig {
  type:
    | 'text'
    | 'select'
    | 'betterSelect'
    | 'number'
    | 'date'
    | 'hide'
    | 'boolean'
    | 'password'
  options?: (data: any) => Promise<{ id: string; name: string; value?: any }[]>
  dependsOn?: string[]
  multiple?: boolean
  accessor?: (data: any) => any
  necessary?: boolean
  value?: any
}

const getFieldDefaultValue = (key: string, fieldConfig: FieldConfig, data: any) => {
  const value = fieldConfig.accessor ? fieldConfig.accessor(data) : data?.[key]

  if (fieldConfig.necessary && value === undefined) {
    return undefined
  }

  switch (fieldConfig.type) {
    case 'boolean':
      return value !== undefined ? Boolean(value) : false
    case 'date':
      return value ? new Date(value).toISOString() : ''
    case 'number':
      return value !== undefined ? Number(value) : 0
    case 'betterSelect':
    case 'select':
      return value !== undefined
        ? fieldConfig.multiple
          ? [value]
          : value
        : fieldConfig.multiple
          ? []
          : ''
    default:
      return value !== undefined ? value : ''
  }
}

interface CustomUpdateFormProps {
  open: boolean
  onClose: () => void
  onSubmit: (values: any) => void
  fieldConfigs: Record<string, FieldConfig>
  data?: any
  loading?: boolean
  children?: (data: any) => React.ReactNode
}

import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { generatePassword } from '@/lib/generatePassword'
import { BetterButton } from '@/components/shadcn/betterButton'

const generateZodSchema = (fieldConfigs: Record<string, FieldConfig>) => {
  const schemaShape = {} as any

  for (const [key, config] of Object.entries(fieldConfigs)) {
    if (config.necessary == false) {
      schemaShape[key] = z.any().optional()
    } else {
      switch (config.type) {
        case 'boolean':
          schemaShape[key] = z.boolean()
          break
        case 'date':
          schemaShape[key] = z.string().nonempty('Date is required')
          break
        case 'number':
          schemaShape[key] = z.number().nonnegative('Number must be non-negative')
          break
        case 'password':
          schemaShape[key] = z
            .string()
            .min(6, 'Password must be at least 6 characters long')
          break
        case 'betterSelect':
        case 'select':
          schemaShape[key] = config.multiple
            ? z.array(z.any()).nonempty('Selection is required')
            : z.any()
          break
        default:
          schemaShape[key] = z
            .string()
            .nonempty(`${key.charAt(0).toUpperCase() + key.slice(1)} is required`)
      }
    }
  }

  return z.object(schemaShape)
}

const CustomUpdateForm = ({
  loading,
  open,
  onClose,
  onSubmit,
  fieldConfigs,
  data,
  children,
}: CustomUpdateFormProps) => {
  const schema = generateZodSchema(fieldConfigs)

  const formMethods = useForm({
    resolver: zodResolver(schema),
    defaultValues: useMemo(
      () =>
        Object.fromEntries(
          Object.keys(fieldConfigs).map((key) => [
            key,
            getFieldDefaultValue(key, fieldConfigs[key], data),
          ])
        ),
      [fieldConfigs, data]
    ),
  })

  const formValues = useWatch({ control: formMethods.control })
  const [options, setOptions] = useState<
    Record<string, { id: string; name: string; value?: any }[]>
  >({})

  const fetchOptions = useCallback(
    async (key: string, config: FieldConfig) => {
      if (config.options) {
        const dependsOnData = config.dependsOn
          ? config.dependsOn.reduce((acc, dep) => {
              acc[dep] = formValues[dep]
              return acc
            }, {} as any)
          : {}

        if (
          Object.values(dependsOnData).every(
            (value) => value !== undefined && value !== null
          )
        ) {
          try {
            const newOptions = await config.options(dependsOnData)
            setOptions((prevOptions) => ({ ...prevOptions, [key]: newOptions }))
          } catch (error) {
            console.error(`Error fetching options for ${key}:`, error)
          }
        }
      }
    },
    [formValues]
  )

  useEffect(() => {
    const fetchInitialOptions = async () => {
      const newOptions: Record<string, { id: string; name: string; value?: any }[]> = {}
      for (const [key, config] of Object.entries(fieldConfigs)) {
        if (config.options) {
          const dependsOnData = config.dependsOn
            ? config.dependsOn.reduce((acc, dep) => {
                acc[dep] = data ? data[dep] : formValues[dep]
                return acc
              }, {} as any)
            : {}
          try {
            newOptions[key] = await config.options(dependsOnData)
          } catch (error) {
            console.error(`Error fetching initial options for ${key}:`, error)
          }
        }
      }
      setOptions(newOptions)
    }

    fetchInitialOptions()
  }, [data, fieldConfigs])

  useEffect(() => {
    for (const [key, config] of Object.entries(fieldConfigs)) {
      if (config.dependsOn) {
        fetchOptions(key, config)
      }
    }
  }, [formValues, fieldConfigs, fetchOptions])

  const handleFormSubmit = (values: any) => {
    const processedValues = {} as any

    for (const [key, config] of Object.entries(fieldConfigs)) {
      if (config.type === 'betterSelect' || config.type === 'select') {
        if (config.multiple) {
          processedValues[key] = values[key].map((item: any) => item.value || item.id)
        } else {
          processedValues[key] = values[key]?.value || values[key]?.id || null
        }
      } else {
        processedValues[key] = values[key]
      }
    }
    console.log(processedValues, values)

    return processedValues
  }

  return (
    <Dialog
      modal={true}
      open={open}
      onOpenChange={onClose}
      aria-labelledby='form-dialog-title'
    >
      <DialogContent className='flex h-[80vh] w-2/3 flex-col'>
        {children && children(handleFormSubmit(formValues))}
        <DialogHeader>
          <DialogTitle id='form-dialog-title'>Formulaire</DialogTitle>
        </DialogHeader>

        <ScrollArea className='flex-1 p-4'>
          <FormProvider {...formMethods}>
            <form
              onSubmit={formMethods.handleSubmit((data) => {
                onSubmit(handleFormSubmit(data))
              })}
              className='m-4 space-y-4'
            >
              {Object.entries(fieldConfigs).map(([key, config]) => (
                <FormField
                  key={key}
                  control={formMethods.control}
                  name={key}
                  render={({ field, formState }) => (
                    <FormItem className='flex flex-col'>
                      <FormLabel>{key.charAt(0).toUpperCase() + key.slice(1)}</FormLabel>
                      <FormControl>
                        {config.type === 'betterSelect' ? (
                          <BetterSelect
                            title={
                              config.multiple
                                ? field.value?.length > 0
                                  ? `${field.value.length} selected`
                                  : 'Select items'
                                : field.value && field.value != ''
                                  ? field.value.name
                                  : 'Select an item'
                            }
                            multiple={config.multiple}
                            items={options[key] || []}
                            selectedItems={field.value || ''}
                            setSelectedItems={(items) => field.onChange(items)}
                          />
                        ) : config.type === 'select' ? (
                          <select
                            value={field.value || ''}
                            onChange={(e) => field.onChange(e.target.value)}
                            className='rounded border px-2 py-1'
                          >
                            {(options[key] || []).map((option) => (
                              <option key={option.id} value={option.id}>
                                {option.name}
                              </option>
                            ))}
                          </select>
                        ) : config.type === 'boolean' ? (
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        ) : config.type === 'date' ? (
                          <DatePicker {...field} />
                        ) : config.type === 'password' ? (
                          <div className='flex items-center gap-2'>
                            <Input type='text' {...field} />
                            <Button
                              type='button'
                              onClick={() => field.onChange(generatePassword())}
                            >
                              Générer
                            </Button>
                          </div>
                        ) : (
                          <Input type={config.type} {...field} />
                        )}
                      </FormControl>
                      {/* <FormMessage>{formState.errors[key]?.message}</FormMessage> */}
                    </FormItem>
                  )}
                />
              ))}

              <BetterButton loading={loading} type='submit'>
                Submit
              </BetterButton>
            </form>
          </FormProvider>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

export default CustomUpdateForm
