import { DateTime } from 'luxon'
import {
  BaseModel,
  beforeSave,
  BelongsTo,
  belongsTo,
  column,
} from '@ioc:Adonis/Lucid/Orm'
import Category from './Category'
import Region from './Region'

export default class Place extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public category_id: number

  @column()
  public latitude: number

  @column()
  public longitude: number

  @column({ serializeAs: null })
  public location: string

  @column({ serializeAs: null })
  public region_id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static assignLocation(place: Place) {
    place.location = `(${place.latitude},${place.longitude})`
  }

  @belongsTo(() => Category, {
    foreignKey: 'category_id',
  })
  public category: BelongsTo<typeof Category>

  @belongsTo(() => Region, {
    foreignKey: 'region_id',
  })
  public region: BelongsTo<typeof Region>
}
