import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, TextInput, Button, FlatList } from 'react-native';
import * as firebase from 'firebase';

export default function App() {
  const [product, setProduct] = useState('');
  const [amount, setAmount] = useState('');
  const [shoppingList, setShoppingList] = useState([]);
  
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyCscPrioYRsFHTx6MIXjbuMaf0ngxgpUQg",
    authDomain: "shoppinglist-12009.firebaseapp.com",
    databaseURL: "https://shoppinglist-12009-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "shoppinglist-12009",
    storageBucket: "shoppinglist-12009.appspot.com",
    messagingSenderId: "246131758389",
    appId: "1:246131758389:web:22fbe828207e1a299ca87c",
    measurementId: "G-0R5CT305MN"
  };

  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
   } else {
    firebase.app(); // if already initialized, use that one
  }

  useEffect(() => {
    getProducts();    
  }, []);

  const getProducts = () => {
    firebase.database().ref('items/').on('value', snapshot => {
      const data = snapshot.val();
      const productArray = [];
      if (data) {
        const tempArray = Object.entries(data);
        //Get amount, product and firebase-id from data
        for (let i = 0; i < tempArray.length; i++) {
          productArray.push({amount: tempArray[i][1].amount,  product: tempArray[i][1].product, id: tempArray[i][0]});
        }
      }
      setShoppingList(productArray);
    });
  }
    
  const saveProduct = () => {
    firebase.database().ref('items/').push(
        {'product': product, 'amount': amount}
      );
      setProduct('');
      setAmount('');
  }

  const deleteProduct = (id) => {
    let productRef = firebase.database().ref('items/' + id);
    productRef.remove();
    getProducts();
  }
  
  return (
    <View style={styles.container}>
      <TextInput style={styles.textInputStyle} onChangeText={text => setProduct(text)} value={product} placeholder='Product'></TextInput>
      <TextInput style={styles.textInputStyle} onChangeText={text => setAmount(text)} value={amount} placeholder='amount'></TextInput>
      <Button title="SAVE" onPress={saveProduct}></Button>
      <Text style={styles.shoppingListStyle}>Shopping List</Text>
      <FlatList 
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item, index}) => 
        <View style={styles.listcontainer}>
          <Text>{item.product}, {item.amount}</Text>
          <Text style={{fontSize: 24, color: '#0000ff'}} onPress={() => deleteProduct(item.id)}> bought</Text>
        </View>} 
        data={shoppingList} 
      />
      
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 80
  },
  textInputStyle: {
    width: 200,
    minHeight: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10
  },
  shoppingListStyle: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#00008B',
    marginTop: 10  
  },
  listcontainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    alignItems: 'center'
   },
});

