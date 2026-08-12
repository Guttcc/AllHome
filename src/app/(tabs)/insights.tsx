import ClearCompletedButton from "@/components/insights/ClearCompletedButton";
import InsightsCategorySection from "@/components/insights/InsightsCategorySection";
import InsightsPrioritySection from "@/components/insights/InsightsPrioritySection";
import InsightsStatsSection from "@/components/insights/InsightsStatsSection";
import SentryFeedbackButton from "@/components/insights/SentryFeedbackButton";
import UserProfile from "@/components/insights/UserProfile";
import TabScreenBackground from "@/components/TabScreenBackground";
import { ScrollView } from "react-native";

const InsightsScreen = () => {
    return (
        <>
            <ScrollView
                className="flex-1 bg-background py-4"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ padding: 20, gap: 14 }}
                contentInsetAdjustmentBehavior="automatic"
            >
                <TabScreenBackground />

                <UserProfile />
                <InsightsStatsSection />
                <InsightsCategorySection />
                <InsightsPrioritySection />
                <ClearCompletedButton />
            </ScrollView>

            <SentryFeedbackButton />
        </>
    );
};

export default InsightsScreen;