import { DateTime } from 'luxon'
import { BaseModel, beforeSave, column } from '@ioc:Adonis/Lucid/Orm'

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

  @beforeSave()
  public static assignLocation(region: Region) {
    region.location = `(${region.latitude},${region.longitude})`
  }
}
