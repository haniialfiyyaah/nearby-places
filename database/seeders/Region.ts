import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Region from 'App/Models/Region'
import { promises as fs } from 'fs'

const filterDataWilayah = (arr, type, level) => {
  return arr
    .filter(({ longitude, latitude }) => longitude && latitude)
    .map((data) => {
      return {
        name: data[`kemendagri_${type}_nama`],
        level,
        kemendagri_code: data[`kemendagri_${type}_kode`],
        longitude: data.longitude,
        latitude: data.latitude,
      }
    })
}

const readFile = async (PATH) =>
  JSON.parse((await fs.readFile(PATH)).toString()).data

export default class RegionSeeder extends BaseSeeder {
  public async run() {
    /* kabupaten */
    const kab = await readFile('data-kabupaten.json')
    const kabupaten = filterDataWilayah(kab, 'kota', 'Kabupaten/Kota')
    await Region.createMany(kabupaten)

    /* kecamatan */
    const kec = await readFile('data-kecamatan.json')
    const kecamatan = filterDataWilayah(kec, 'kecamatan', 'Kecamatan')
    await Region.createMany(kecamatan)

    /* kelurahan */
    const kel = await readFile('data-kelurahan.json')
    const kelurahan = filterDataWilayah(kel, 'kelurahan', 'Kelurahan/Desa')
    await Region.createMany(kelurahan)
  }
}
