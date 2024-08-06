import React, { useState } from 'react';
import { Text, View, TextInput, TouchableOpacity, Keyboard, KeyboardAvoidingView, ScrollView, StyleSheet, Platform } from 'react-native';
import Reminder from './components/Reminder/Reminder';

interface ReminderItem {
    text: string;
    time: string;
}

export default function App() {
    const [reminderText, setReminderText] = useState<string>('');
    const [reminderTime, setReminderTime] = useState<string>('');
    const [reminderList, setReminderList] = useState<ReminderItem[]>([]);

    const addReminder = () => {
        Keyboard.dismiss();
        setReminderList([...reminderList, { text: reminderText, time: reminderTime }]);
        setReminderText('');
        setReminderTime('');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>Today's Reminders ⏰</Text>
        
            <View style={styles.remindersWrapper}>
                <ScrollView style={styles.items}>
                    {
                        reminderList.map((item, index) => {
                            return (
                                <Reminder text={item.text} time={item.time} key={index} />
                            );
                        })
                    }
                </ScrollView>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.inputWrapper}
            >
                <TextInput 
                    style={styles.input} 
                    placeholder={'Write a reminder'} 
                    value={reminderText} 
                    onChangeText={text => setReminderText(text)} 
                />
                <TextInput 
                    style={styles.input} 
                    placeholder={'Set time (e.g., 14:00)'} 
                    value={reminderTime} 
                    onChangeText={time => setReminderTime(time)} 
                />
                <TouchableOpacity onPress={addReminder}>
                    <View style={styles.addButton}>
                        <Text>+</Text>
                    </View>
                </TouchableOpacity>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#a3b18a',
    },
    remindersWrapper: {
        height: '80%',
    },
    sectionTitle: {
        marginTop: 70,
        paddingHorizontal: 20,
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
    items: {
        marginTop: 10,
        marginBottom: 10,
        maxHeight: '87%',
        paddingHorizontal: 20,
    },
    inputWrapper: {
        position: 'absolute',
        bottom: 60,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        paddingVertical: 15,
        paddingHorizontal: 15,
        backgroundColor: '#FFF',
        borderRadius: 60,
        borderColor: '#588157',
        borderWidth: 2,
        marginRight: 10,
    },
    addButton: {
        width: 60,
        height: 60,
        backgroundColor: '#FFF',
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#588157',
        borderWidth: 2,
    },
});
