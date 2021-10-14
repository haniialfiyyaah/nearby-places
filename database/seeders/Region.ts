import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import filterWilayah from 'App/Helpers/filterWilayah'
import readFile from 'App/Helpers/readFile'
import Region from 'App/Models/Region'

export default class RegionSeeder extends BaseSeeder {
  public async run() {
    /* kabupaten */
    const kab = await readFile('data-kabupaten.json')
    const kabupaten = filterWilayah(kab, 'kota', 'Kabupaten/Kota')
    await Region.createMany(kabupaten)

    /* kecamatan */
    const kec = await readFile('data-kecamatan.json')
    const kecamatan = filterWilayah(kec, 'kecamatan', 'Kecamatan')
    await Region.createMany(kecamatan)

    /* kelurahan */
    const kel = await readFile('data-kelurahan.json')
    const kelurahan = filterWilayah(kel, 'kelurahan', 'Kelurahan/Desa')
    await Region.createMany(kelurahan)
  }
}
