import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity, FlatList, Keyboard } from 'react-native';
import Icon from 'react-native-vector-icons/Feather'

import firebase from './src/firebaseConection'
import TaskList from './src/TaskList'

console.disableYellowBox = true

export default function App() {
  const inputRef = useRef(null)
  const [novaTask, setNovaTask] = useState('')
  const [tasks, setTasks] = useState([])
  const [key, setKey] = useState('')

  useEffect(() => {

    async function loadTasks() {
      await firebase.database().ref('tarefas').on('value', (snapshot) => {
        setTasks([])

        snapshot.forEach((childItem) => {
          let data = {
            key: childItem.key,
            nome: childItem.val().nome
          }
          setTasks(oldArray => [...oldArray, data])
        })
      })
    }
    loadTasks()
  }, [])

  async function addTarefa() {
    if (novaTask !== '') {

      if (key !== '') {
        await firebase.database().ref('tarefas').child(key).update({
          nome: novaTask
        })
        Keyboard.dismiss()
        setNovaTask('')
        setKey()
        return
      }

      let tarefas = await firebase.database().ref('tarefas')
      let chave = tarefas.push().key

      tarefas.child(chave).set({
        nome: novaTask
      })

      Keyboard.dismiss(
        setNovaTask('')
      )
    }
  }

  async function deletaTarefa(key) {
    await firebase.database().ref('tarefas').child(key).remove()
  }

  function editItem(data) {
    setNovaTask(data.nome)
    setKey(data.key)
    inputRef.current.focus()
  }

  function cancelEdit(){
    setKey('')
    setNovaTask('')
    Keyboard.dismiss
  }

  return (
    <View style={styles.container}>

      {key.length > 0 && (
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity onPress={cancelEdit}>
            <Icon name='x-circle' size={20} color='#FF0000' />
          </TouchableOpacity>

          <Text style={{ marginLeft: 5, marginBottom: 8, color: '#FF0000' }}>
            Você esta editando uma tarefa
        </Text>
        </View>
      )}
      <View style={styles.containerTask}>
        <TextInput style={styles.input}
          placeholder='o que vai fazer hoje?'
          underlineColorAndroid='transparent'
          onChangeText={(texto) => setNovaTask(texto)}
          value={novaTask}
          ref={inputRef}
        />
        <TouchableOpacity style={styles.buttonAdd} onPress={addTarefa}>
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={tasks}
        keyExtractor={item => item.key}
        renderItem={({ item }) => (
          <TaskList data={item} deleteItem={deletaTarefa} editarItem={editItem} />
        )}
      />

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 70,
    marginLeft: 10,
    marginRight: 10,
  },
  containerTask: {
    flexDirection: 'row'
  },
  input: {
    flex: 1,
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: 'black',
    height: 40,
    fontSize: 16
  },
  buttonAdd: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    backgroundColor: 'black',
    paddingLeft: 14,
    paddingRight: 14,
    marginLeft: 5
  },
  buttonText: {
    fontSize: 23,
    color: 'white'
  }
})