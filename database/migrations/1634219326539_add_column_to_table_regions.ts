import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Regions extends BaseSchema {
  protected tableName = 'regions'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('city_name')
      table.string('district_name')
      table.string('village_name')
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('city_name')
      table.dropColumn('district_name')
      table.dropColumn('village_name')
    })
  }
}
