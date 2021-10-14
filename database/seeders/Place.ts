import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Category from 'App/Models/Category'
import Place from 'App/Models/Place'
import Region from 'App/Models/Region'
import randomLocation from 'random-location'
import { string } from '@ioc:Adonis/Core/Helpers'

const polas = {
  'Kabupaten/Kota': [
    //level
    [
      'Kantor Pemerintah Kabupaten/Kota', //category
      1, //total
      (name) => `Kantor Pemerintahan ${name}`, // name pola
    ],
    ['Rumah Sakit', 3, (name, i) => `Rumah Sakit ${name} ${i}`],
    ['Sekolah Menengah Atas', 20, (name, i) => `SMA ${name} ${i}`],
  ],
  Kecamatan: [
    ['Puskesmas', 5, (name, i) => `Puskesmas ${name} ${i}`],
    ['Sekolah Menengah Pertama', 3, (name, i) => `SMP ${name} ${i}`],
    ['Kantor Pemerintah Kecamatan', 1, (name) => `Kantor Pemerintahan ${name}`],
  ],
  'Kelurahan/Desa': [
    ['Sekolah Dasar', 1, (name, i) => `SD ${name} ${i}`],
    ['Tempat Ibadah', 20, (name, i) => `Tempat Ibadah ${name} ${i}`],
    [
      'Kantor Pemerintah Kelurahan / Desa',
      1,
      (name) => `Kantor Pemerintah ${name}`,
    ],
  ],
}

export default class PlaceSeeder extends BaseSeeder {
  public async run() {
    console.log('It will take few minutes ...')

    /* Loop pola data */
    for (const lev in polas) {
      const pola = polas[lev]

      /* Search wilayah by level */
      const regions = await Region.query().where('level', lev)
      console.log(`We have about ${regions.length} ${lev}`)

      for (const i in pola) {
        const [cat, total, fName] = pola[i]
        console.log(`Please wait ... \n Cteated ${total} places`)

        /* Create category */
        await Category.create({ name: cat })
        let category_id = (await Category.findBy('name', cat))?.id

        /* Loop regions */
        for (const e in regions) {
          const { id: region_id, name: nm, longitude, latitude } = regions[e]

          /* Create places by total */
          for (let i = 0; i < total; i++) {
            /* Pola name */
            let name = fName(string.capitalCase(nm), i + 1)

            /* Random location */
            let radius = Math.floor(Math.random() * 3000 + 100) // 0.3 - 3 km
            const location = randomLocation.randomCirclePoint(
              { latitude, longitude },
              radius
            )

            /* Create places */
            await Place.create({
              name,
              category_id,
              longitude: location.longitude,
              latitude: location.latitude,
              region_id,
            })
          }
        }
      }
    }
  }
}
