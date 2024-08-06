import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';

interface ReminderProps {
    text: string;
    time: string;
    isChecked: boolean;
    onToggleCheck: () => void;
}

const Reminder: React.FC<ReminderProps> = ({ text, time, isChecked, onToggleCheck }) => {
    const timeString = new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const fadeAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        if (isChecked) {
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 1000,
                useNativeDriver: true,
            }).start();
        } else {
            fadeAnim.setValue(1);
        }
    }, [isChecked]);

    return (
        <Animated.View style={[styles.item, { opacity: fadeAnim }]}>
            <TouchableOpacity onPress={onToggleCheck} style={styles.checkbox}>
                <Text>{isChecked ? '✅' : '⬜'}</Text>
            </TouchableOpacity>
            <View style={styles.textWrapper}>
                <Text style={styles.itemText}>{text}</Text>
                <Text style={styles.itemTime}>{timeString}</Text>
            </View>
            <Text style={styles.emoji}>🎉</Text>
        </Animated.View>
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
    textWrapper: {
        flex: 1,
        marginHorizontal: 10,
    },
    itemText: {
        color: '#588157',
    },
    itemTime: {
        color: '#588157',
    },
    checkbox: {
        width: 24,
        height: 24,
        borderWidth: 2,
        borderColor: '#588157',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emoji: {
        fontSize: 24,
    },
});

export default Reminder;
