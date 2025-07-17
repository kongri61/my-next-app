import { Client } from '@notionhq/client'

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
})

const databaseId = process.env.NOTION_DATABASE_ID

export interface NotionProperty {
  id: string
  title: string
  description: string
  price: number
  priceType: string
  propertyType: string
  bedrooms: number
  bathrooms: number
  size: number
  location: string
  coordinates: [number, number]
  images: string[]
  features: string[]
  contact: {
    name: string
    phone: string
    email: string
  }
}

export async function getProperties(): Promise<NotionProperty[]> {
  try {
    const response = await notion.databases.query({
      database_id: databaseId!,
      sorts: [
        {
          property: 'Created time',
          direction: 'descending',
        },
      ],
    })

    return response.results.map((page: any) => {
      const properties = page.properties
      
      return {
        id: page.id,
        title: properties.Title?.title?.[0]?.plain_text || '',
        description: properties.Description?.rich_text?.[0]?.plain_text || '',
        price: properties.Price?.number || 0,
        priceType: properties.PriceType?.select?.name || '매매',
        propertyType: properties.PropertyType?.select?.name || '아파트',
        bedrooms: properties.Bedrooms?.number || 1,
        bathrooms: properties.Bathrooms?.number || 1,
        size: properties.Size?.number || 0,
        location: properties.Location?.rich_text?.[0]?.plain_text || '',
        coordinates: [
          properties.Latitude?.number || 37.5665,
          properties.Longitude?.number || 126.9780
        ],
        images: properties.Images?.files?.map((file: any) => file.file?.url) || [],
        features: properties.Features?.multi_select?.map((item: any) => item.name) || [],
        contact: {
          name: properties.ContactName?.rich_text?.[0]?.plain_text || '',
          phone: properties.ContactPhone?.phone_number || '',
          email: properties.ContactEmail?.email || ''
        }
      }
    })
  } catch (error) {
    console.error('Notion API Error:', error)
    return []
  }
}

export async function createProperty(property: Omit<NotionProperty, 'id'>): Promise<string | null> {
  try {
    const response = await notion.pages.create({
      parent: { database_id: databaseId! },
      properties: {
        Title: {
          title: [
            {
              text: {
                content: property.title,
              },
            },
          ],
        },
        Description: {
          rich_text: [
            {
              text: {
                content: property.description,
              },
            },
          ],
        },
        Price: {
          number: property.price,
        },
        PriceType: {
          select: {
            name: property.priceType,
          },
        },
        PropertyType: {
          select: {
            name: property.propertyType,
          },
        },
        Bedrooms: {
          number: property.bedrooms,
        },
        Bathrooms: {
          number: property.bathrooms,
        },
        Size: {
          number: property.size,
        },
        Location: {
          rich_text: [
            {
              text: {
                content: property.location,
              },
            },
          ],
        },
        Latitude: {
          number: property.coordinates[0],
        },
        Longitude: {
          number: property.coordinates[1],
        },
        Features: {
          multi_select: property.features.map(feature => ({ name: feature })),
        },
        ContactName: {
          rich_text: [
            {
              text: {
                content: property.contact.name,
              },
            },
          ],
        },
        ContactPhone: {
          phone_number: property.contact.phone,
        },
        ContactEmail: {
          email: property.contact.email,
        },
      },
    })

    return response.id
  } catch (error) {
    console.error('Notion API Error:', error)
    return null
  }
} 