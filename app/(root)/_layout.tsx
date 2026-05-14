import { useGlobalContext } from "@/lib/global-provider";
import { Redirect } from "expo-router";
import React from "react";
import { ActivityIndicator, SafeAreaView } from "react-native";

export default function AppLayout() {
    const { loading, isLoggedIn } = useGlobalContext();

    if (loading) {
        return (
            <SafeAreaView className="bg-white h-full flex justify-center items-center">
                <ActivityIndicator className= "text-primary-300"
                size="large" color="#0000ff" />
            </SafeAreaView>
        )
    }

    if (!isLoggedIn) {
        return <Redirect href="/sign-in" />

    }
}