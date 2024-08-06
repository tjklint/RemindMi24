import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface ReminderProps {
    text: string;
    time: string;
    isChecked: boolean;
    onToggleCheck: () => void;
}

const Reminder: React.FC<ReminderProps> = ({ text, time, isChecked, onToggleCheck }) => {
    const timeString = new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
        <View style={styles.item}>
            <View>
                <Text style={styles.itemText}>{text}</Text>
                <Text style={styles.itemTime}>{timeString}</Text>
            </View>
            <TouchableOpacity onPress={onToggleCheck} style={styles.checkbox}>
                <Text>{isChecked ? '✅' : '⬜'}</Text>
            </TouchableOpacity>
            <Text style={styles.partyEmoji}>🎉</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    item: {
        backgroundColor: '#FFF',
        padding: 15,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    itemText: {
        maxWidth: '80%',
        color: '#588157',
    },
    itemTime: {
        color: '#588157',
    },
    checkbox: {
        marginRight: 10,
    },
    partyEmoji: {
        fontSize: 24,
    },
});

export default Reminder;
