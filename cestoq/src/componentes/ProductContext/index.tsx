import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import axios from 'axios';

interface Brand {
    id: number;
    name: string;
}

interface ProductType {
    id: number;
    name: string;
}

interface ProductContextType {
    brands: Brand[];
    productTypes: ProductType[];
    loadBrands: () => void;
    loadProductTypes: () => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

interface ProductProviderProps {
    children: ReactNode;
}

export const ProductProvider: React.FC<ProductProviderProps> = ({ children }) => {
    const [brands, setBrands] = useState<Brand[]>([]);
    const [productTypes, setProductTypes] = useState<ProductType[]>([]);

    const loadBrands = async () => {
        try {
            const response = await axios.get<Brand[]>('http://localhost:5124/api/Brands/VerMarcas');
            setBrands(response.data);
        } catch (error) {
            console.error('Erro ao carregar marcas:', error);
        }
    };

    const loadProductTypes = async () => {
        try {
            const response = await axios.get<ProductType[]>('http://localhost:5124/api/ProductTypes/VerTipos');
            setProductTypes(response.data);
        } catch (error) {
            console.error('Erro ao carregar tipos de produtos:', error);
        }
    };

    useEffect(() => {
        loadBrands();
        loadProductTypes();
    }, []);

    return (
        <ProductContext.Provider value={{ brands, productTypes, loadBrands, loadProductTypes }}>
            {children}
        </ProductContext.Provider>
    );
};

export const useProductContext = () => {
    const context = useContext(ProductContext);
    if (!context) {
        throw new Error('useProductContext must be used within a ProductProvider');
    }
    return context;
};
