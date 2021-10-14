import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import filterWilayah from 'App/Helpers/filterWilayah'
import Region from 'App/Models/Region'
import axios from 'axios'
import { URL_KAB, URL_KEC, URL_KEL } from 'Config/constants'

export default class RegionSeeder extends BaseSeeder {
  public async run() {
    /* kelurahan */
    // let villages = await readFile('data-kelurahan.json')
    const { data: kel }: { data } = await axios.get(`${URL_KEL}?limit=6000`)
    let villagesAPI = kel?.data
    let villages = filterWilayah(villagesAPI, 'kelurahan', 'Kelurahan/Desa')
    await Region.createMany(villages)

    /* kecamatan */
    // let districs = await readFile('data-kecamatan.json')
    const { data: kec }: { data } = await axios.get(`${URL_KEC}?limit=1000`)
    let districs = kec?.data
    districs = filterWilayah(districs, 'kecamatan', 'Kecamatan', villagesAPI)
    await Region.createMany(districs)

    /* kabupaten */
    // let cities = await readFile('data-kabupaten.json')
    const { data: kab }: { data } = await axios.get(`${URL_KAB}?limit=50`)
    let cities = kab?.data
    cities = filterWilayah(cities, 'kota', 'Kabupaten/Kota', villagesAPI)
    await Region.createMany(cities)
  }
}
