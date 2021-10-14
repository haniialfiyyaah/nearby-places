import { DateTime } from 'luxon'
import {
  BaseModel,
  beforeSave,
  column,
  HasMany,
  hasMany,
} from '@ioc:Adonis/Lucid/Orm'
import Place from './Place'

export default class Region extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public level: 'Kabupaten/Kota' | 'Kecamatan' | 'Kelurahan/Desa'

  @column()
  public kemendagri_code: string

  @column()
  public latitude: number

  @column()
  public longitude: number

  @column({ serializeAs: null })
  public location: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column()
  public city_name: string

  @column()
  public district_name: string

  @column()
  public village_name: string

  @beforeSave()
  public static assignLocation(region: Region) {
    region.location = `(${region.latitude},${region.longitude})`
  }

  @hasMany(() => Place, {
    foreignKey: 'region_id',
  })
  public places: HasMany<typeof Place>
}
