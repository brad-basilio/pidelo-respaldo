import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, X, ArrowRight, Heart, Share2, Edit } from "lucide-react";

// Animaciones configuradas
const animations = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        when: "beforeChildren"
      }
    }
  },
  item: {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    },
    hover: {
      y: -5,
      scale: 1.03,
      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
      transition: { duration: 0.2 }
    }
  },
  modal: {
    overlay: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
      exit: { opacity: 0 }
    },
    content: {
      hidden: { scale: 0.9, opacity: 0 },
      visible: { 
        scale: 1, 
        opacity: 1,
        transition: { type: "spring", damping: 25 }
      },
      exit: { scale: 0.9, opacity: 0 }
    }
  },
  button: {
    hover: { x: -3 },
    tap: { scale: 0.95 }
  },
  title: {
    hidden: { x: -20, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  }
};

// Datos de ejemplo mejorados
const productos = [
  {
    id: 1,
    imagen: "/assets/img/backgrounds/resources/default-image.png",
    titulo: "Poster Fotográfico 75×108 Vertical",
    descripcion: "Impresión de alta calidad en papel fotográfico brillante. Perfecto para decorar tus espacios.",
    precio: 89.90,
    descuento: 15,
    colores: ["#FF5733", "#33FF57", "#3357FF"],
    tags: ["Popular", "Nuevo"]
  },  {
    id: 2,
    imagen: "/assets/img/backgrounds/resources/default-image.png",
    titulo: "Poster Fotográfico 75×108 Vertical",
    descripcion: "Impresión de alta calidad en papel fotográfico brillante. Perfecto para decorar tus espacios.",
    precio: 89.90,
    descuento: 15,
    colores: ["#FF5733", "#33FF57", "#3357FF"],
    tags: ["Popular", "Nuevo"]
  },
  {
    id: 3,
    imagen: "/assets/img/backgrounds/resources/default-image.png",
    titulo: "Poster Fotográfico 75×108 Vertical",
    descripcion: "Impresión de alta calidad en papel fotográfico brillante. Perfecto para decorar tus espacios.",
    precio: 89.90,
    descuento: 15,
    colores: ["#FF5733", "#33FF57", "#3357FF"],
    tags: ["Popular", "Nuevo"]
  },
  {
    id: 4,
    imagen: "/assets/img/backgrounds/resources/default-image.png",
    titulo: "Poster Fotográfico 75×108 Vertical",
    descripcion: "Impresión de alta calidad en papel fotográfico brillante. Perfecto para decorar tus espacios.",
    precio: 89.90,
    descuento: 15,
    colores: ["#FF5733", "#33FF57", "#3357FF"],
    tags: ["Popular", "Nuevo"]
  },
  {
    id: 5,
    imagen: "/assets/img/backgrounds/resources/default-image.png",
    titulo: "Poster Fotográfico 75×108 Vertical",
    descripcion: "Impresión de alta calidad en papel fotográfico brillante. Perfecto para decorar tus espacios.",
    precio: 89.90,
    descuento: 15,
    colores: ["#FF5733", "#33FF57", "#3357FF"],
    tags: ["Popular", "Nuevo"]
  },
  {
    id: 6,
    imagen: "/assets/img/backgrounds/resources/default-image.png",
    titulo: "Poster Fotográfico 75×108 Vertical",
    descripcion: "Impresión de alta calidad en papel fotográfico brillante. Perfecto para decorar tus espacios.",
    precio: 89.90,
    descuento: 15,
    colores: ["#FF5733", "#33FF57", "#3357FF"],
    tags: ["Popular", "Nuevo"]
  },
  {
    id: 8,
    imagen: "/assets/img/backgrounds/resources/default-image.png",
    titulo: "Poster Fotográfico 75×108 Vertical",
    descripcion: "Impresión de alta calidad en papel fotográfico brillante. Perfecto para decorar tus espacios.",
    precio: 89.90,
    descuento: 15,
    colores: ["#FF5733", "#33FF57", "#3357FF"],
    tags: ["Popular", "Nuevo"]
  },
  {
    id: 9,
    imagen: "/assets/img/backgrounds/resources/default-image.png",
    titulo: "Poster Fotográfico 75×108 Vertical",
    descripcion: "Impresión de alta calidad en papel fotográfico brillante. Perfecto para decorar tus espacios.",
    precio: 89.90,
    descuento: 15,
    colores: ["#FF5733", "#33FF57", "#3357FF"],
    tags: ["Popular", "Nuevo"]
  },
  // ... (otros productos con estructura similar)
];

const CardBanana = ({ producto, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.a
      href="/canva2"
      className="block bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all cursor-pointer relative"
      variants={animations.item}
      whileHover={{
        scale: 1.02,
        boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.2)",
        transition: { duration: 0.3 },
    }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(producto.id)}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Etiquetas 
      {producto.tags && (
        <div className="absolute top-2 left-2 z-10 flex gap-1">
          {producto.tags.map((tag, index) => (
            <motion.span 
              key={index}
              className="text-xs px-2 py-1 rounded-full bg-primary text-white font-medium"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              {tag}
            </motion.span>
          ))}
        </div>
      )}*/}

      {/* Imagen del producto */}
      <div className="aspect-square bg-gray-100 relative overflow-hidden">
        <motion.img 
          src={producto.imagen} 
          alt={producto.titulo}
          className="w-full h-full object-cover"
          initial={{ scale: 1 }}
          animate={{ scale: isHovered ? 1.05 : 1 }}
          transition={{ duration: 0.3 }}
          onError={(e) => e.target.src = "/placeholder-image.png"}
        />

        {/* Efecto hover */}
        <AnimatePresence>
          {isHovered && (
            <motion.div 
              className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.a 
              href="/canva2"
                
                className="bg-white customtext-primary rounded-full p-3 shadow-lg"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Edit size={20} />
              </motion.a>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Contenido de la tarjeta */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 mb-1 line-clamp-1">
          {producto.titulo}
        </h3>
        <p className="text-gray-500 text-sm line-clamp-2 mb-2">
          {producto.descripcion}
        </p>
        {/* Precio del producto
        <div className="flex justify-between items-center">
          <div>
            {producto.descuento > 0 && (
              <span className="text-xs text-gray-400 line-through mr-2">
                S/ {(producto.precio).toFixed(2)}
              </span>
            )}
            <span className="font-bold text-primary">
              S/ {(producto.precio * (1 - producto.descuento/100)).toFixed(2)}
            </span>
          </div>
        </div> */}
      </div>
    </motion.a>
  );
};

const ProductoModal = ({ producto, onClose }) => {
  const [selectedColor, setSelectedColor] = useState(producto.colores[0]);
  const [quantity, setQuantity] = useState(1);

  return (
    <motion.div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      variants={animations.modal.overlay}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.div 
        className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        variants={animations.modal.content}
      >
        {/* Header del modal */}
        <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center z-10">
          <h2 className="text-xl font-bold">{producto.titulo}</h2>
          <motion.button
            className="p-2 rounded-full hover:bg-gray-100"
            onClick={onClose}
            whileHover={{ rotate: 90, scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X className="h-5 w-5" />
          </motion.button>
        </div>

        {/* Contenido del modal */}
        <div className="grid md:grid-cols-2 gap-8 p-6">
          {/* Galería de imágenes */}
          <div className="space-y-4">
            <div className="bg-gray-100 rounded-lg overflow-hidden aspect-square">
              <img 
                src={producto.imagen} 
                alt={producto.titulo}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((item) => (
                <motion.div
                  key={item}
                  className="bg-gray-100 rounded-md aspect-square cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                >
                  <img 
                    src={producto.imagen} 
                    alt={`Vista ${item}`}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Detalles del producto */}
          <div>
            <p className="text-gray-700 mb-6">{producto.descripcion}</p>
            
            {/* Precio */}
            <div className="mb-6">
              {producto.descuento > 0 && (
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm text-gray-500 line-through">
                    S/ {producto.precio.toFixed(2)}
                  </span>
                  <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded">
                    -{producto.descuento}%
                  </span>
                </div>
              )}
              <p className="text-3xl font-bold text-primary">
                S/ {(producto.precio * (1 - producto.descuento/100)).toFixed(2)}
              </p>
            </div>

            {/* Selector de color */}
            {producto.colores && (
              <div className="mb-6">
                <h3 className="font-medium mb-2">Color:</h3>
                <div className="flex gap-2">
                  {producto.colores.map((color) => (
                    <motion.button
                      key={color}
                      className={`w-8 h-8 rounded-full border-2 ${selectedColor === color ? 'border-primary' : 'border-transparent'}`}
                      style={{ backgroundColor: color }}
                      onClick={() => setSelectedColor(color)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Selector de cantidad */}
            <div className="mb-6">
              <h3 className="font-medium mb-2">Cantidad:</h3>
              <div className="flex items-center border rounded-lg w-max overflow-hidden">
                <motion.button
                  className="px-3 py-2 bg-gray-100 hover:bg-gray-200"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  whileTap={{ scale: 0.9 }}
                >
                  <Minus size={16} />
                </motion.button>
                <span className="px-4 py-2 w-12 text-center">{quantity}</span>
                <motion.button
                  className="px-3 py-2 bg-gray-100 hover:bg-gray-200"
                  onClick={() => setQuantity(quantity + 1)}
                  whileTap={{ scale: 0.9 }}
                >
                  <Plus size={16} />
                </motion.button>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="space-y-3">
              <motion.button
                className="w-full bg-primary text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Agregar al carrito
              </motion.button>
              <div className="flex gap-3">
                <motion.button
                  className="flex-1 border border-primary text-primary py-3 rounded-lg font-medium flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Heart size={18} /> Guardar
                </motion.button>
                <motion.button
                  className="flex-1 border border-primary text-primary py-3 rounded-lg font-medium flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Share2 size={18} /> Compartir
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function Canva1() {
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleProductClick = (id) => {
    setSelectedProduct(productos.find(p => p.id === id));
  };

  return (
    <motion.div 
      className="container mx-auto px-4 py-8 max-w-7xl font-paragraph"
      initial="hidden"
      animate="visible"
      variants={animations.container}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <motion.button 
          className="flex items-center customtext-primary"
          variants={animations.button}
          whileHover="hover"
          whileTap="tap"
        >
          <ChevronLeft className="h-5 w-5" />
          <span className="ml-1">Regresar</span>
        </motion.button>
      </div>

      {/* Título */}
      <motion.h1 
        className="text-3xl md:text-4xl font-bold mb-8 text-start"
        variants={animations.title}
      >
        Elige el diseño predefinido
      </motion.h1>

      {/* Grid de productos */}
      <motion.div 
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        variants={animations.container}
      >
        <AnimatePresence>
          {productos.map((producto) => (
            <motion.div
              key={producto.id}
              variants={animations.item}
              layoutId={`product-${producto.id}`}
            >
              <CardBanana 
                producto={producto} 
                onClick={handleProductClick} 
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Modal de producto */}
      <AnimatePresence>
        {selectedProduct && (
          <ProductoModal 
            producto={selectedProduct} 
            onClose={() => setSelectedProduct(null)} 
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}