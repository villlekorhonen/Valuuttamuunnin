import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Image, Keyboard } from 'react-native';
import axios from 'axios';
import ModalDropdown from 'react-native-modal-dropdown';



export default function App() {
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [amount, setAmount] = useState('');
  const apiKey = '6309wwMftpiV0FSOzBvSqBII7UKsaXqc';
  const [exchangeRates, setExchangeRates] = useState({});
  const [result, setResult] = useState('EUR');
  const [convertedAmount, setConvertedAmount] = useState(null);
  const apiURL = `https://api.apilayer.com/exchangerates_data/latest`;


  useEffect(() => {
    fetchExchangeRate();

  }, [result, selectedCurrency]);

  const fetchExchangeRate = async () => {
    try {
      const response = await axios.get(apiURL, {
        headers: {
          'apikey': apiKey,
        },
        params: {
          base: result,
        },
      });
      const rates = response.data.rates;
      setExchangeRates(rates);
    } catch (error) {
      console.error('Houston we have a problem:', error);
    }
  };

  const handleConvert = () => {
    if (!amount || isNaN(amount) || !exchangeRates[selectedCurrency]) {
      setConvertedAmount(null);
      return;
    }
    const converted = parseFloat(amount) / exchangeRates[selectedCurrency];
    setConvertedAmount(converted.toFixed(2));

    Keyboard.dismiss();
  };

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.header}>Currency Exchanger</Text>
      </View>
      <Image style={styles.image} source={{ uri: 'https://images.unsplash.com/photo-1604594849809-dfedbc827105?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80' }}
      />


      <View style={styles.currencyContainer}>
        <View style={styles.currency}>
          <Text style={styles.text2}>To Currency:</Text>
          <ModalDropdown
            options={Object.keys(exchangeRates)}
            style={styles.dropdown}
            textStyle={styles.dropdownText}
            defaultValue={result}
            onSelect={(index, value) => setResult(value)}
          />
        </View>

        <View style={styles.currency}>
          <Text style={styles.text2}>From Currency:</Text>
          <ModalDropdown
            options={Object.keys(exchangeRates)}
            style={styles.dropdown}
            textStyle={styles.dropdownText}
            defaultValue={selectedCurrency}
            onSelect={(index, value) => setSelectedCurrency(value)}
          />
        </View>
      </View>

      <TextInput style={styles.input}
        value={amount}
        onChangeText={(text) => setAmount(text)}
        keyboardType="numeric"
        placeholder='Amount'
      />

      <TouchableOpacity style={styles.button} onPress={handleConvert}>
        <Text style={styles.text}>Convert</Text>
      </TouchableOpacity>

      {convertedAmount !== null && (
        <Text style={styles.result}>
          {amount} {selectedCurrency} = {convertedAmount} EUR
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'teal',
    alignItems: 'center',
    justifyContent: 'center',
  },
  currencyContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  currency: {
    flex: 1,
    flexDirection: 'column',
    marginRight: 10,
    alignItems: 'center',

  },
  dropdown: {
    width: 60,
    padding: 10,
    backgroundColor: 'aqua',
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 5,
    marginTop: 5,
  },
  dropdownText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    marginLeft: 5,
    color: 'black',
  },
  button: {
    width: 150,
    height: 50,
    borderColor: 'black',
    borderWidth: 3,
    backgroundColor: 'turquoise',
    textAlign: 'center',
    color: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    marginBottom: 20,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',


  },
  text2: {
    fontSize: 20,
    fontWeight: '700',
    color: 'white',
  },
  input: {
    fontSize: 20,
    fontWeight: '700',
    backgroundColor: 'aquamarine',
    color: 'black',
    width: 200,
    height: 50,
    textAlign: 'center',
    borderColor: 'black',
    borderRadius: 10,
    borderWidth: 3,
    marginBottom: 20,
  },
  header: {
    fontSize: 40,
    fontWeight: '700',
    backgroundColor: 'teal',
    borderRadius: 5,
    color: 'white',
    width: 300,
    textAlign: 'center',
    borderColor: 'white',
    borderWidth: 3
  },
  result: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    textDecorationLine: 'underline',

  },
  image: {
    width: '97%',
    height: '33%',
    marginBottom: 10,
    marginTop: 25,
    borderRadius: 5
  },
});
