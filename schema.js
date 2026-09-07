export const typeDefs = `#graphql
  type Product {
    id: ID!
    nombre: String!
    descripcion: String
    precio: Int!
    disponible: Boolean!
  }

  type Customer {
    run: String!
    nombreCompleto: String!
    direccion: String!
    comuna: String!
    provincia: String
    region: String
    email: String!
    telefono: String
  }

  type OrderItem {
    producto: Product!
    cantidad: Int!
  }

  type Order {
    id: ID!
    cliente: Customer!
    items: [OrderItem!]!
    total: Int!
    estado: String!
    motivoAnulacion: String
  }

  type Query {
    obtenerMenu: [Product!]!
    obtenerPedido(id: ID!): Order
    obtenerPerfilCliente(run: String!): Customer
  }

  input OrderItemInput {
    productoId: ID!
    cantidad: Int!
  }

  input CustomerInput {
    run: String!
    nombreCompleto: String!
    direccion: String!
    comuna: String!
    email: String!
    telefono: String
  }

  type Mutation {
    crearPedido(clienteRun: String!, items: [OrderItemInput!]!): Order
    anularPedido(id: ID!, motivo: String!): Order
    registrarCliente(input: CustomerInput!): Customer
  }
`;