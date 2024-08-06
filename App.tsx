import React, { useState, useEffect } from 'react';
import { Text, View, TextInput, TouchableOpacity, Keyboard, KeyboardAvoidingView, ScrollView, StyleSheet, Platform } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import * as Notifications from 'expo-notifications';
import Reminder from './components/Reminder/Reminder';

interface ReminderItem {
    text: string;
    time: Date;
}

export default function App() {
    const [reminderText, setReminderText] = useState<string>('');
    const [reminderTime, setReminderTime] = useState<Date>(new Date());
    const [reminderList, setReminderList] = useState<ReminderItem[]>([]);
    const [showTimePicker, setShowTimePicker] = useState<boolean>(false);

    useEffect(() => {
        Notifications.requestPermissionsAsync();
    }, []);

    const scheduleNotification = async (text: string, time: Date) => {
        await Notifications.scheduleNotificationAsync({
            content: {
                title: "Reminder",
                body: text,
            },
            trigger: time,
        });
    };

    const addReminder = () => {
        Keyboard.dismiss();
        const newReminder: ReminderItem = { text: reminderText, time: reminderTime };
        setReminderList([...reminderList, newReminder]);
        scheduleNotification(reminderText, reminderTime);
        setReminderText('');
        setReminderTime(new Date());
    };

    const handleTimeChange = (event: DateTimePickerEvent, selectedTime?: Date) => {
        setShowTimePicker(false);
        if (selectedTime) {
            setReminderTime(selectedTime);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>Today's Reminders ⏰</Text>
        
            <View style={styles.remindersWrapper}>
                <ScrollView style={styles.items}>
                    {
                        reminderList.map((item, index) => {
                            return (
                                <Reminder text={item.text} time={item.time.toISOString()} key={index} />
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
                <TouchableOpacity onPress={() => setShowTimePicker(true)}>
                    <View style={styles.timeButton}>
                        <Text>Select Time</Text>
                    </View>
                </TouchableOpacity>
                {showTimePicker && (
                    <DateTimePicker
                        value={reminderTime}
                        mode="time"
                        is24Hour={true}
                        display="default"
                        onChange={handleTimeChange}
                    />
                )}
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
    timeButton: {
        backgroundColor: '#FFF',
        padding: 15,
        borderRadius: 60,
        borderColor: '#588157',
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
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
