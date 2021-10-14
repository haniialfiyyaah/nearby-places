/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'
import Database from '@ioc:Adonis/Lucid/Database'
import Region from 'App/Models/Region'
import axios from 'axios'
import { URL_KEL } from 'Config/constants'
import { string } from '@ioc:Adonis/Core/Helpers'

Route.get('/', async () => {
  //
})

Route.get('/search', async ({ request }) => {
  interface ResponseSearch {
    id: number
    name: string
    category_id: number
    city_name: string
    district_name: string
    latitude: number
    longitude: number
  }

  const { longitude, latitude, category_id } = request.qs()
  // error required
  if (!longitude || !latitude) {
    return {
      status: 'error',
      message: 'Longitude and latitude is required as query',
    }
  }
  // search location
  const { rows } = await Database.rawQuery(`
    select * from (SELECT  *,
    ( 5000 * acos( cos( radians(${latitude}) ) * cos( radians( latitude ) ) * cos( radians( longitude )
    - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin( radians( latitude ) ) ) ) AS distance 
    FROM places ${category_id ? `where category_id=${category_id}` : ''} ) al 
    where distance < 5
    ORDER BY distance`)

  let result: ResponseSearch[] = []
  for (const i in rows) {
    const row = rows[i]
    const { kemendagri_code, level } = await Region.findOrFail(row.region_id)
    const type =
      level === 'Kecamatan'
        ? 'kemendagri_kecamatan_kode'
        : level === 'Kabupaten/Kota'
        ? 'kemendagri_kelurahan_kode'
        : 'kemendagri_kota_kode'
    const { data }: { data } = await axios.get(
      `${URL_KEL}?limit=1&${type}=${kemendagri_code}`
    )
    result.push({
      id: row.id,
      name: row.name,
      category_id: row.category_id,
      city_name: string.capitalCase(data?.data[0].bps_kota_nama),
      district_name: string.capitalCase(data?.data[0].bps_kecamatan_nama),
      latitude: row.latitude,
      longitude: row.longitude,
    })
  }
  return result
})
