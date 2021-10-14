import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Places extends BaseSchema {
  protected tableName = 'places'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('region_id').unsigned().references('id').inTable('regions')
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('region_id')
    })
  }
}
