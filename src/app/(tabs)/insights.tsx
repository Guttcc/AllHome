import BudgetSection from "@/components/insights/BudgetSection";
import ClearCompletedButton from "@/components/insights/ClearCompletedButton";
import InsightsCategorySection from "@/components/insights/InsightsCategorySection";
import InsightsPrioritySection from "@/components/insights/InsightsPrioritySection";
import InsightsStatsSection from "@/components/insights/InsightsStatsSection";
import InviteGroupButton from "@/components/insights/InviteGroupButton";
import LeaveGroupButton from "@/components/insights/LeaveGroupButton";
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
                <BudgetSection />
                <InsightsCategorySection />
                <InsightsPrioritySection />
                <ClearCompletedButton />
                <InviteGroupButton />
                <LeaveGroupButton />
            </ScrollView>

            <SentryFeedbackButton />
        </>
    );
};

export default InsightsScreen;