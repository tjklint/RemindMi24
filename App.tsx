import React, { useState, useEffect } from 'react';
import { Text, View, TextInput, TouchableOpacity, Keyboard, KeyboardAvoidingView, ScrollView, StyleSheet, Platform } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import * as Notifications from 'expo-notifications';
import Toast from 'react-native-toast-message';
import Reminder from './components/Reminder/Reminder';

interface ReminderItem {
    text: string;
    time: Date;
    isChecked: boolean;
    id: number;
}

export default function App() {
    const [reminderText, setReminderText] = useState<string>('');
    const [reminderTime, setReminderTime] = useState<Date>(new Date());
    const [reminderList, setReminderList] = useState<ReminderItem[]>([]);
    const [showTimePicker, setShowTimePicker] = useState<boolean>(false);

    useEffect(() => {
        Notifications.requestPermissionsAsync();
        Notifications.addNotificationReceivedListener(notification => {
            Toast.show({
                type: 'success',
                text1: notification.request.content.title || undefined,
                text2: notification.request.content.body || undefined
            });
        });
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
        const newReminder: ReminderItem = { text: reminderText, time: reminderTime, isChecked: false, id: Date.now() };
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

    const toggleCheck = (id: number) => {
        setReminderList(prevList => prevList.map(reminder => 
            reminder.id === id ? { ...reminder, isChecked: !reminder.isChecked } : reminder
        ));
    };

    const removeReminder = (id: number) => {
        setReminderList(prevList => prevList.filter(reminder => reminder.id !== id));
    };

    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>Today's Reminders ⏰</Text>
        
            <View style={styles.remindersWrapper}>
                <ScrollView style={styles.items}>
                    {
                        reminderList.map((item) => {
                            return (
                                <Reminder 
                                    text={item.text} 
                                    time={item.time.toISOString()} 
                                    isChecked={item.isChecked} 
                                    key={item.id} 
                                    onToggleCheck={() => toggleCheck(item.id)} 
                                    onRemove={() => removeReminder(item.id)}
                                />
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

            <Toast />
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
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20, // Added padding to prevent touching the edges
    },
    input: {
        flex: 1,
        paddingVertical: 15,
        paddingHorizontal: 15,
        backgroundColor: '#FFF',
        borderRadius: 60,
        borderColor: '#588157',
        borderWidth: 2,
    },
    timeButton: {
        backgroundColor: '#FFF',
        padding: 15,
        borderRadius: 60,
        borderColor: '#588157',
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10, // Added margin to create space between elements
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
        marginLeft: 10,
    },
});
