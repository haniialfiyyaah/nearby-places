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
  const { longitude, latitude, category_id, limit, radius } = request.qs()
  let distance_unit = 111.045 // km unit
  // error required
  if (!longitude || !latitude) {
    return {
      status: 'error',
      message: 'Longitude and latitude is required as query',
    }
  }

  const { rows } = await Database.rawQuery(`
      SELECT id, name, category_id, latitude, longitude, city_name, district_name, distance
      FROM (
      SELECT z.id, z.name, z.category_id,
              z.latitude, z.longitude,
              r.city_name, r.district_name,
              p.radius,
              p.distance_unit
                      * DEGREES(ACOS(COS(RADIANS(p.latpoint))
                      * COS(RADIANS(z.latitude))
                      * COS(RADIANS(p.longpoint - z.longitude))
                      + SIN(RADIANS(p.latpoint))
                      * SIN(RADIANS(z.latitude)))) AS distance
        FROM places AS z
        JOIN regions as r ON z.region_id = r.id 
        JOIN (   /* these are the query parameters */
              SELECT  ${+latitude}  AS latpoint,  ${+longitude} AS longpoint,
                      ${+radius || 5.0} AS radius,
                      ${distance_unit} AS distance_unit
          ) AS p ON 1=1
        WHERE z.latitude
          BETWEEN p.latpoint  - (p.radius / p.distance_unit)
              AND p.latpoint  + (p.radius / p.distance_unit)
          AND z.longitude
          BETWEEN p.longpoint - (p.radius / (p.distance_unit * COS(RADIANS(p.latpoint))))
              AND p.longpoint + (p.radius / (p.distance_unit * COS(RADIANS(p.latpoint))))
          ${category_id ? `AND category_id=${category_id}` : ''}
      ) AS d
      WHERE distance <= radius
      ORDER BY distance
      LIMIT ${+limit || 20}
  `)

  return { total: rows.length, data: rows }
})

Route.any('*', ({ response }) => response.redirect().toPath('/docs'))
