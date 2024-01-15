import { StyleSheet, View, Text, FlatList, ListRenderItem, Image, TouchableOpacity } from 'react-native';
import data from '../../assets/data.json'
import { Ionicons } from '@expo/vector-icons';
import useCartStore from '../../store/cartStore';
import { useEffect } from 'react';

export default function TabOneScreen() {
  const { reduceProduct, addProduct } = useCartStore();

  useEffect(() => {
    useCartStore.subscribe((state) => {
      console.log('STATE: ', state);
  });
  }, []);
  const renderItem: ListRenderItem<any> = ({ item }) => (
    <View style={styles.cartItemContainer}>
      <Image style={styles.cartItemImage} source={{ uri: item.image }} />
      <View style={styles.itemContainer}>
        <Text style={styles.cartItemName}>{item.title}</Text>
        <Text>${item.price}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={() => reduceProduct(item)}>
          <Ionicons name="remove" size={20} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => addProduct(item)}>
          <Ionicons name="add" size={20} color="black" />
        </TouchableOpacity>
        </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList data={data} renderItem={renderItem} keyExtractor={(item) => item.id.toString()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cartItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    marginBottom: 10,
  },
  cartItemImage: {
    width: 50,
    height: 50,
    objectFit: 'contain',
  },
  itemContainer: {
    flex: 1,
  },
  cartItemName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  }
});
