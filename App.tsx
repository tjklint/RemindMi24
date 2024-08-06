import React, { useState, useEffect } from 'react';
import { Text, View, TextInput, TouchableOpacity, Keyboard, KeyboardAvoidingView, ScrollView, StyleSheet, Platform, Modal, Linking } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import * as Notifications from 'expo-notifications';
import Toast from 'react-native-toast-message';
import Reminder from './components/Reminder/Reminder';
import Icon from 'react-native-vector-icons/FontAwesome';

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
    const [modalVisible, setModalVisible] = useState<boolean>(false);

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
            <View style={styles.header}>
                <Text style={styles.sectionTitle}>RemindMi24 ⏰</Text>
                <TouchableOpacity style={styles.infoIcon} onPress={() => setModalVisible(true)}>
                    <Icon name="info-circle" size={30} color="#FFF" />
                </TouchableOpacity>
            </View>
        
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

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(!modalVisible)}
            >
                <View style={styles.modalView}>
                    <Text style={styles.modalText}>
                        RemindMi24 is a reminder app exclusively for setting reminders within the next 24 hours.
                    </Text>
                    <Text style={styles.modalText}>
                        Simplistic and stylish. No nonsense, no interruptions.
                    </Text>
                    <Text style={[styles.modalText, styles.boldText]}>
                        Developed with <Text style={{ color: 'green' }}>❤️</Text> by Timothy (TJ) Klint
                    </Text>
                    <Text style={styles.bulletPoint}>• Connect with him on <Text style={styles.link} onPress={() => Linking.openURL('https://www.linkedin.com/in/timothy-klint/')}>LinkedIn</Text></Text>
                    <Text style={styles.bulletPoint}>• Star his repo, and view the source code: <Text style={styles.link} onPress={() => Linking.openURL('https://github.com/tjklint/RemindMii')}>here</Text></Text>
                    <TouchableOpacity
                        style={[styles.button, styles.buttonClose]}
                        onPress={() => setModalVisible(!modalVisible)}
                    >
                        <Text style={styles.textStyle}>Close</Text>
                    </TouchableOpacity>
                </View>
            </Modal>

            <Toast />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#a3b18a',
        paddingTop: '20%', // Increased padding to bring down the header
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginBottom: 20, // Added marginBottom to create space below the header
    },
    infoIcon: {
        marginLeft: 10,
    },
    remindersWrapper: {
        height: '80%',
    },
    sectionTitle: {
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
        paddingHorizontal: 20,
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
        marginLeft: 10,
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
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        marginTop: 20,
    },
    buttonClose: {
        backgroundColor: '#2196F3',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
    boldText: {
        fontWeight: 'bold',
    },
    bulletPoint: {
        marginBottom: 10,
        textAlign: 'left',
        width: '100%',
    },
    link: {
        color: '#2196F3',
    },
});
