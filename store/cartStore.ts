import { StateCreator, StoreMutatorIdentifier, create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { zustandStorage } from "./mmkv";

type Logger = <
	T extends unknown,
	Mps extends [StoreMutatorIdentifier, unknown][] = [],
	Mcs extends [StoreMutatorIdentifier, unknown][] = []
>(
	f: StateCreator<T, Mps, Mcs>,
	name?: string
) => StateCreator<T, Mps, Mcs>;

type LoggerImpl = <T extends unknown>(
	f: StateCreator<T, [], []>,
	name?: string
) => StateCreator<T, [], []>;

const loggerImpl: LoggerImpl = (f, name) => (set, get, store) => {
	type T = ReturnType<typeof f>;
	const loggedSet: typeof set = (...a) => {
		set(...a);
		console.log(...(name ? [`${name}:`] : []), get());
	};
	store.setState = loggedSet;

	return f(loggedSet, get, store);
};

export const logger = loggerImpl as unknown as Logger;

export interface CartSate {
    products: Array<Product & {quantity: number}>;
    addProduct: (product: Product) => void;
    reduceProduct: (product: Product) => void;
    clearCart: () => void;
    items: () => number;
    total: () => string;
}

const useCartStore = create<CartSate>()(
    persist(
    logger((set, get) => ({
        products: [],
        addProduct: (product: Product) => set((state) => {
            let hasProduct = false;
            const products = state.products.map((p) => {
                if (p.id === product.id) {
                    hasProduct = true;
                    return { ...p, quantity: p.quantity + 1 };
                }
                return p;
            })
            if (hasProduct) {
                return { products };
            }
            return { products: [...products, { ...product, quantity: 1 }] };
        }),
        reduceProduct: (product: Product) => set((state) => {
            return {
                products: state.products.map((p) => {
                    if (p.id === product.id) {
                        return { ...p, quantity: p.quantity - 1 };
                    }
                    return p;
                }).filter((p) => p.quantity > 0),
            }
        }),
        clearCart: () => set(() => {
            return { products: [] };
        }),
        items: () => get().products.reduce((acc, p) => acc + p.quantity, 0),
        total: () => get().products.reduce((acc, p) => acc + p.quantity * p.price, 0)
        .toFixed(2),
    })), {
        name: 'cart',
        storage: createJSONStorage(() => zustandStorage),
        }
    )
);

export default useCartStore;