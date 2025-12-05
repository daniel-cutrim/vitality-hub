import { useState } from 'react';
import { motion } from 'framer-motion';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { 
  ShoppingBag, 
  ExternalLink, 
  Star,
  Filter
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Product {
  id: number;
  name: string;
  brand: string;
  description: string;
  benefits: string[];
  price: number;
  originalPrice?: number;
  imageUrl: string;
  category: string;
  rating: number;
  affiliateLink: string;
}

const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Whey Protein Isolado',
    brand: 'Gold Nutrition',
    description: 'Proteína de alta qualidade com 27g de proteína por dose. Ideal para ganho de massa muscular e recuperação pós-treino.',
    benefits: ['27g proteína por dose', 'Baixo carboidrato', 'Rápida absorção', 'Sem glúten'],
    price: 189.90,
    originalPrice: 229.90,
    imageUrl: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400&h=400&fit=crop',
    category: 'Suplementos',
    rating: 4.8,
    affiliateLink: '#'
  },
  {
    id: 2,
    name: 'Creatina Monohidratada',
    brand: 'Power Labs',
    description: 'Creatina pura para aumento de força e performance. 200 doses por embalagem.',
    benefits: ['100% pura', '200 doses', 'Sem aditivos', 'Testada em laboratório'],
    price: 89.90,
    imageUrl: 'https://images.unsplash.com/photo-1594498653385-d5172c532c00?w=400&h=400&fit=crop',
    category: 'Suplementos',
    rating: 4.9,
    affiliateLink: '#'
  },
  {
    id: 3,
    name: 'Ashwagandha KSM-66',
    brand: 'Natural Health',
    description: 'Adaptógeno premium para redução do estresse e melhora do desempenho físico e mental.',
    benefits: ['Reduz cortisol', 'Melhora o sono', 'Aumenta energia', 'Certificado orgânico'],
    price: 79.90,
    imageUrl: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=400&fit=crop',
    category: 'Fitoterápicos',
    rating: 4.7,
    affiliateLink: '#'
  },
  {
    id: 4,
    name: 'Luvas de Treino Pro',
    brand: 'FitGear',
    description: 'Luvas profissionais com proteção para palma e pulso. Ideal para musculação e CrossFit.',
    benefits: ['Proteção completa', 'Material respirável', 'Ajuste perfeito', 'Durabilidade'],
    price: 59.90,
    originalPrice: 79.90,
    imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=400&fit=crop',
    category: 'Acessórios',
    rating: 4.6,
    affiliateLink: '#'
  },
  {
    id: 5,
    name: 'Ômega 3 Premium',
    brand: 'Vita Plus',
    description: 'Ômega 3 de alta concentração com EPA e DHA para saúde cardiovascular e cerebral.',
    benefits: ['1000mg EPA/DHA', 'Sem metais pesados', '120 cápsulas', 'Certificação IFOS'],
    price: 119.90,
    imageUrl: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=400&h=400&fit=crop',
    category: 'Suplementos',
    rating: 4.8,
    affiliateLink: '#'
  },
  {
    id: 6,
    name: 'Garrafa Térmica 1L',
    brand: 'HydroFit',
    description: 'Garrafa térmica premium que mantém sua bebida gelada por 24h ou quente por 12h.',
    benefits: ['Aço inoxidável', '24h gelado', 'BPA Free', 'Design ergonômico'],
    price: 129.90,
    imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop',
    category: 'Acessórios',
    rating: 4.9,
    affiliateLink: '#'
  }
];

const categories = ['Todos', 'Suplementos', 'Fitoterápicos', 'Acessórios'];

export default function Shopping() {
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const filteredProducts = selectedCategory === 'Todos' 
    ? mockProducts 
    : mockProducts.filter(p => p.category === selectedCategory);

  return (
    <AppLayout>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold text-foreground">Shopping</h1>
        <p className="text-muted-foreground">Produtos selecionados para você</p>
      </motion.div>

      {/* Categories */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex gap-2 mb-6 overflow-x-auto pb-2 -mx-4 px-4"
      >
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all",
              selectedCategory === category
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground hover:bg-accent"
            )}
          >
            {category}
          </button>
        ))}
      </motion.div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 gap-3">
        {filteredProducts.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 + index * 0.05 }}
            onClick={() => setSelectedProduct(product)}
            className="bg-card rounded-xl border border-border overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
          >
            <div className="aspect-square bg-secondary relative">
              <img 
                src={product.imageUrl} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs">
                Parceiro
              </Badge>
            </div>
            <div className="p-3">
              <p className="text-xs text-muted-foreground">{product.brand}</p>
              <h3 className="font-medium text-foreground text-sm line-clamp-2 leading-tight mt-0.5">
                {product.name}
              </h3>
              <div className="flex items-center gap-1 mt-1">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span className="text-xs text-muted-foreground">{product.rating}</span>
              </div>
              <div className="mt-2">
                {product.originalPrice && (
                  <span className="text-xs text-muted-foreground line-through mr-2">
                    R$ {product.originalPrice.toFixed(2)}
                  </span>
                )}
                <span className="font-bold text-primary">
                  R$ {product.price.toFixed(2)}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Product Detail Modal */}
      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          {selectedProduct && (
            <>
              <div className="aspect-video bg-secondary rounded-lg overflow-hidden -mx-6 -mt-6 mb-4">
                <img 
                  src={selectedProduct.imageUrl} 
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <DialogHeader>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="secondary">{selectedProduct.category}</Badge>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="text-sm">{selectedProduct.rating}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{selectedProduct.brand}</p>
                <DialogTitle className="text-xl">{selectedProduct.name}</DialogTitle>
              </DialogHeader>

              <p className="text-muted-foreground text-sm">
                {selectedProduct.description}
              </p>

              <div className="space-y-2 mt-4">
                <h4 className="font-semibold text-sm">Benefícios:</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProduct.benefits.map((benefit, i) => (
                    <span 
                      key={i}
                      className="text-xs px-2 py-1 bg-accent text-accent-foreground rounded-full"
                    >
                      {benefit}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
                <div>
                  {selectedProduct.originalPrice && (
                    <span className="text-sm text-muted-foreground line-through block">
                      R$ {selectedProduct.originalPrice.toFixed(2)}
                    </span>
                  )}
                  <span className="text-2xl font-bold text-primary">
                    R$ {selectedProduct.price.toFixed(2)}
                  </span>
                </div>
                <Button className="btn-primary-gradient" size="lg">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Comprar
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
