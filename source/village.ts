import {Modeler, DevModeler} from "vineyard-ground"
const sequelize = require("sequelize")

export interface ModelInterface {
  ground
  db
  User
}

export interface DatabaseConfig {
  devMode?: boolean
}

export interface CommonPrivateConfig {
  database: DatabaseConfig
}

export interface PublicConfig {

}

export interface VillageSettings<PrivateConfig extends CommonPrivateConfig> {
  privateConfig: PrivateConfig
  publicConfig: PublicConfig
  schema: any
}

export class GenericVillage<Model extends ModelInterface, PrivateConfig extends CommonPrivateConfig> {
  private model: Model
  private privateConfig: PrivateConfig
  private publicConfig: PublicConfig

  constructor(settings: VillageSettings<PrivateConfig>) {
    this.privateConfig = settings.privateConfig
    this.publicConfig = settings.publicConfig
    this.model = this.createModel(settings.schema)
  }

  private createModel(schema): Model {
    const db = new sequelize(this.privateConfig.database)
    const modeler = !this.privateConfig.database.devMode
      ? new Modeler(db, schema)
      : new DevModeler(db, schema)

    const model = Object.assign({
      ground: modeler,
      db: db
    }, modeler.collections)
    return model
  }

  getModel(): Model {
    return this.model
  }

  getPrivateConfig() {
    return this.privateConfig
  }

  getPublicConfig() {
    return this.publicConfig
  }

  getGround(): Modeler {
    return this.model.ground
  }

}