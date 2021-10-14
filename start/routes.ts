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

Route.get('/search', async ({ request }) => {
  const { longitude, latitude, category_id } = request.qs()
  // error required
  if (!longitude || !latitude) {
    return {
      status: 'error',
      message: 'Longitude and latitude is required as query',
    }
  }
  const { rows } = await Database.rawQuery(`
    select * from (SELECT places.id, places.name, places .category_id, places.latitude, places.longitude, regions.city_name, regions.district_name, ( 5000 * acos( cos( radians(${latitude}) ) * cos( radians( places.latitude ) ) * cos( radians( places.longitude ) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin( radians( places.latitude ) ) ) ) AS distance
    FROM places join regions on places.region_id = regions.id ${
      category_id ? `where category_id=${category_id}` : ''
    }
    ) al 
    where distance < 5
    ORDER BY distance`)

  return { total: rows.length, data: rows }
})

Route.any('*', ({ response }) => response.redirect().toPath('/docs'))
