// Datos simulados
const productosMock = [
  { id: "1", nombre: "Trufa Clásica", descripcion: "Caja 12 trufas artesanales", precio: 5000, disponible: true },
  { id: "2", nombre: "Barra Cacao 70%", descripcion: "Barra de cacao puro", precio: 3500, disponible: true }
];

const clientesMock = [];
const pedidosMock = [];

export const resolvers = {
  Query: {
    obtenerMenu: () => productosMock,
    obtenerPedido: (_, { id }) => pedidosMock.find(p => p.id === id),
    obtenerPerfilCliente: (_, { run }) => clientesMock.find(c => c.run === run),
  },
  Mutation: {
    registrarCliente: (_, { input }) => {
      const nuevoCliente = { ...input };
      clientesMock.push(nuevoCliente);
      return nuevoCliente;
    },
    crearPedido: (_, { clienteRun, items }) => {
      const cliente = clientesMock.find(c => c.run === clienteRun);
      if (!cliente) throw new Error("Solo clientes registrados pueden comprar");

      const nuevoPedido = {
        id: String(pedidosMock.length + 1),
        cliente: cliente,
        items: items.map(item => ({
          producto: productosMock.find(p => p.id === item.productoId),
          cantidad: item.cantidad
        })),
        total: items.reduce((acc, item) => acc + (productosMock.find(p => p.id === item.productoId).precio * item.cantidad), 0),
        estado: "PENDIENTE"
      };
      pedidosMock.push(nuevoPedido);
      return nuevoPedido;
    },
    anularPedido: (_, { id, motivo }) => {
      const pedido = pedidosMock.find(p => p.id === id);
      if(pedido) {
        pedido.estado = "ANULADO";
        pedido.motivoAnulacion = motivo;
      }
      return pedido;
    }
  }
};