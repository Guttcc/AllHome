import { useAuth } from '@clerk/expo'
import { Redirect } from 'expo-router'
import { NativeTabs } from 'expo-router/unstable-native-tabs'
import { useColorScheme } from 'nativewind'

export default function TabsLayout() {
  const { isSignedIn, isLoaded } = useAuth()


  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const tabTintColor = isDark ? "hsl(142 70% 54%)" : "hsl(147 75% 33%)";


  if (!isLoaded) {
    return null
  }

  if (!isSignedIn) {
    return <Redirect href="/(auth)/sign-in" />
  }

  return (
    <NativeTabs tintColor={tabTintColor}> 

      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>List</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="list.bullet.clipboard" md="assignment"   />
      </NativeTabs.Trigger>
    
      <NativeTabs.Trigger name="planner">
        <NativeTabs.Trigger.Icon sf="plus.circle" md="add" />
        <NativeTabs.Trigger.Label>Planner</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="insights">
        <NativeTabs.Trigger.Icon sf="chart.bar" md="bar_chart" />
        <NativeTabs.Trigger.Label>Insights</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    
    </NativeTabs>
  )
}