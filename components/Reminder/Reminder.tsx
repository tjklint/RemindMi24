import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ReminderProps {
    text: string;
    time: string;
}

const Reminder: React.FC<ReminderProps> = ({ text, time }) => {
    const timeString = new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return (
        <View style={styles.item}>
            <View>
                <Text style={styles.itemText}>{text}</Text>
                <Text style={styles.itemTime}>{timeString}</Text>
            </View>
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
});

export default Reminder;
