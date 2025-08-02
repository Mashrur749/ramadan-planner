"use client";
import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Heart,
  CheckCircle,
  Moon,
  Star,
  // Bell,
  // Flame,
  // Users,
  Gift,
  Zap,
  // Plus,
  // Send,
  // X,
} from "lucide-react";

// TypeScript Interfaces
interface Dua {
  prophet: string;
  arabic: string;
  transliteration: string;
  translation: string;
  reference: string;
}

interface RamadanDay {
  day: number;
  hadith: string;
  source: string;
  quranReading: string;
  deedOfDay: string;
  dua: Dua;
  specialNight?: boolean;
}

interface Prayer {
  fard?: boolean;
  sunnah?: boolean;
}

interface PrayerProgress {
  [prayerName: string]: Prayer;
}

interface QuranProgress {
  memorized?: number;
  recited?: number;
}

interface ChecklistProgress {
  [item: string]: boolean;
}

interface DayProgress {
  prayers?: PrayerProgress;
  quran?: QuranProgress;
  checklist?: ChecklistProgress;
  deedCompleted?: boolean;
  goals?: string;
  completedAt?: Date;
}

interface Progress {
  [day: number]: DayProgress;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  target: number;
}

// interface FamilyMember {
//   id: string;
//   name: string;
//   currentDay: number;
//   streak: number;
//   lastActive: Date;
// }

// interface Notification {
//   id: string;
//   type: "prayer" | "deed" | "social" | "achievement" | "laylat";
//   title: string;
//   message: string;
//   timestamp: Date;
//   read: boolean;
// }

interface SurpriseContent {
  type: "hadith" | "name" | "art" | "dua";
  content: string;
  source?: string;
}

// Sample data with special nights marked
const ramadanData = {
  pledge: {
    title: "THE Ramadan PLEDGE OF INTENTION",
    content: `I, [your name], solemnly make this pledge to my Lord and Cherisher, Allah the Almighty, seeking His assistance and acceptance. Every single action that I do will depend on the quality of my intention. Therefore, I testify that I will always purify and renew my intention and seek for His Forgiveness solely to earn His pleasures.

I promise I will not compare myself to anyone. I believe that everyone is at a different level and success is when I am better than I was yesterday. This Ramadan, I will bring myself to a better level by improving my character. I intend to always repent, forgive others, stop doing bad habits and replace it with good habits.

I agree to keep track of my daily action, to practice self-control, and to motivate myself to do more everyday with the right intention. I agree to continue doing with what I have learned and practiced this month after Ramadan. May Allah grant me guidance and strength to make this Ramadan productive.

May He make it easy for me to turn to Him completely and perpetually. Ameen.`,
  },
  days: [
    {
      day: 1,
      hadith:
        "Whoever would like his provision to be increased and his lifespan extended, let him uphold his ties of kinship.",
      source: "The Prophet Muhammad ﷺ / Bukhari",
      quranReading: "Al Fatiha 01 - Al Baqara 141",
      deedOfDay:
        "Share a beneficial Islamic document, video, quote or image to inspire your friends and family.",
      dua: {
        prophet: "NUH عليه السلام",
        arabic:
          "رَبِّ اغْفِرْ لِي وَلِوَالِدَيَّ وَلِمَن دَخَلَ بَيْتِيَ مُؤْمِنًا وَلِلْمُؤْمِنِينَ وَالْمُؤْمِنَاتِ",
        transliteration:
          "Rabbi ighfir li wa liwālidayya wa liman dakhala baytiya mu'minan wa lil-mu'minina wal-mu'minaat",
        translation:
          "My Lord, forgive me and my parents and anyone who enters my home as a believer, and all the believing men and women.",
        reference: "[Surah Nuh 28]",
      },
    },
    {
      day: 21,
      hadith:
        "Search for the Night of Qadr in the odd nights of the last ten days of Ramadan.",
      source: "The Prophet Muhammad ﷺ / Bukhari",
      quranReading: "Al Ankabut 46 - Al Ahzab 30",
      deedOfDay:
        "Be a charity superhero for the day. Go out into the public and help as many people as you possibly can!",
      specialNight: true,
      dua: {
        prophet: "The Last PROPHET ﷺ",
        arabic: "اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي",
        transliteration:
          "Allaahumma innaka 'afuwwun, tuhibb al-'afwa, fa'fu 'anni",
        translation:
          "O Allah, You are the Most forgiving, and You love to forgive, so forgive me.",
        reference: "[Sahih Muslim]",
      },
    },
    // More days would be here...
  ],
};

const dailyChecklistItems = [
  "SMILED AT SOMEONE",
  "GAVE CHARITY",
  "LEARNED SOMETHING NEW",
  "FED A HUNGRY PERSON",
  "PRAYED IN CONGREGATION",
  "READ MY DAILY ADHKAAR",
  "HELPED SOMEONE OUT",
  "ASKED FOR FORGIVENESS",
  "DID THE DEED OF THE DAY",
  "NO SOCIAL MEDIA/TV FROM ASR TO MAGHRIB",
];

const prayers = [
  { name: "FAJR", icon: "🌅", defaultAmount: "$5" },
  { name: "DHUHR", icon: "☀️", defaultAmount: "$5" },
  { name: "ASR", icon: "🌤️", defaultAmount: "$5" },
  { name: "MAGHRIB", icon: "🌆", defaultAmount: "$5" },
  { name: "ISHA", icon: "🌙", defaultAmount: "$5" },
];

const surpriseContent: SurpriseContent[] = [
  // Hadiths for motivation and achievements
  {
    type: "hadith",
    content: "The best of people are those who benefit others.",
    source: "Prophet Muhammad ﷺ",
  },
  {
    type: "hadith",
    content:
      "A believer is not one who eats his fill while his neighbor goes hungry.",
    source: "Prophet Muhammad ﷺ",
  },
  {
    type: "hadith",
    content: "The upper hand is better than the lower hand.",
    source: "Prophet Muhammad ﷺ",
  },
  {
    type: "hadith",
    content:
      "None of you believes until he loves for his brother what he loves for himself.",
    source: "Prophet Muhammad ﷺ",
  },
  {
    type: "hadith",
    content:
      "The most beloved deed to Allah is the most regular and constant even if it were little.",
    source: "Prophet Muhammad ﷺ",
  },

  // Beautiful Names of Allah for spiritual moments
  {
    type: "name",
    content:
      "Ar-Rahman (الرحمن) - The Most Merciful who shows mercy to all creation",
  },
  {
    type: "name",
    content:
      "As-Sabur (الصبور) - The Patient One who does not hasten punishment",
  },
  { type: "name", content: "Al-Ghafoor (الغفور) - The Repeatedly Forgiving" },
  {
    type: "name",
    content:
      "Al-Wadud (الودود) - The Loving One who loves His righteous servants",
  },
  {
    type: "name",
    content:
      "As-Shakur (الشكور) - The Appreciative who rewards even small good deeds",
  },
  {
    type: "name",
    content: "Al-Kareem (الكريم) - The Generous One, Most Noble",
  },

  // Special duas for spiritual nights and completions
  {
    type: "dua",
    content:
      "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
    source:
      "Our Lord, give us good in this world and good in the hereafter, and save us from the punishment of Fire",
  },
  {
    type: "dua",
    content: "رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي",
    source: "My Lord, expand for me my breast and ease for me my task",
  },
  {
    type: "dua",
    content: "رَبِّ أَعِنِّي وَلَا تُعِنْ عَلَيَّ",
    source: "My Lord, help me and do not help against me",
  },
  {
    type: "dua",
    content:
      "اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ",
    source:
      "O Allah, help me to remember You, thank You, and worship You in the best manner",
  },
];

const RamadanPlannerApp: React.FC = () => {
  const [currentDay, setCurrentDay] = useState<number>(1);
  const [showPledge, setShowPledge] = useState<boolean>(false);
  const [progress, setProgress] = useState<Progress>({});
  const [userName, setUserName] = useState<string>("");
  const [streak, setStreak] = useState<number>(0);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  // const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  // const [notifications, setNotifications] = useState<Notification[]>([]);
  // const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [todaysSurprise, setTodaysSurprise] = useState<SurpriseContent | null>(
    null
  );
  const [showAchievement, setShowAchievement] = useState<Achievement | null>(
    null
  );
  // const [inviteEmail, setInviteEmail] = useState<string>("");
  // const [showFamilyInvite, setShowFamilyInvite] = useState<boolean>(false);
  const [surpriseData, setSurpriseData] = useState<{
    lastShown: string;
    dailyCount: number;
    totalShown: number;
  }>({ lastShown: "", dailyCount: 0, totalShown: 0 });
  // const [showMobileMenu, setShowMobileMenu] = useState<boolean>(false);
  const updateStreak = React.useCallback(() => {
    // const today = new Date().toDateString();
    // const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();

    let currentStreak = 0;
    for (let i = currentDay; i >= 1; i--) {
      if (progress[i]?.completedAt) {
        currentStreak++;
      } else {
        break;
      }
    }
    setStreak(currentStreak);
  }, [currentDay, progress]);

  const canShowSurprise = React.useCallback((): boolean => {
    const today = new Date().toDateString();
    const { lastShown, dailyCount } = surpriseData;

    // Reset daily count if it's a new day
    if (lastShown !== today) {
      setSurpriseData((prev) => ({
        ...prev,
        lastShown: today,
        dailyCount: 0,
      }));
      return true; // First surprise of the day
    }

    // Limit to 2 surprises per day maximum
    return dailyCount < 2;
  }, [surpriseData]);

  const triggerSurpriseContent = React.useCallback(
    (trigger: "achievement" | "streak" | "completion" | "special_day") => {
      if (!canShowSurprise() || todaysSurprise) return;

      let surprisePool = surpriseContent;

      // Different content based on trigger
      switch (trigger) {
        case "achievement":
          // Show special content for achievements
          surprisePool = surpriseContent.filter(
            (s) => s.type === "hadith" || s.type === "name"
          );
          break;
        case "streak":
          // Show motivational content for streaks
          surprisePool = surpriseContent.filter(
            (s) => s.type === "dua" || s.type === "hadith"
          );
          break;
        case "completion":
          // Show any content for daily completion
          break;
        case "special_day":
          // Show special content for odd nights
          surprisePool = surpriseContent.filter((s) => s.type === "dua");
          break;
      }

      if (surprisePool.length === 0) return;

      const randomContent =
        surprisePool[Math.floor(Math.random() * surprisePool.length)];
      setTodaysSurprise(randomContent);

      // Update surprise data
      setSurpriseData((prev) => ({
        ...prev,
        dailyCount: prev.dailyCount + 1,
        totalShown: prev.totalShown + 1,
        lastShown: new Date().toDateString(),
      }));
    },
    [canShowSurprise, todaysSurprise, setTodaysSurprise, setSurpriseData]
  );

  const checkAchievements = React.useCallback(() => {
    const updatedAchievements = achievements.map((achievement) => {
      let newProgress = achievement.progress;

      switch (achievement.id) {
        case "first_week":
          newProgress = streak;
          break;
        case "prayer_master":
          newProgress = Object.values(progress).filter(
            (day) =>
              day.prayers &&
              Object.values(day.prayers).filter(
                (prayer) =>
                  typeof prayer === "object" &&
                  prayer !== null &&
                  "fard" in prayer &&
                  (prayer as Prayer).fard
              ).length >= 5
          ).length;
          break;
        case "charity_champion":
          newProgress = Object.values(progress).filter(
            (day) => day.checklist?.["GAVE CHARITY"]
          ).length;
          break;
        case "quran_lover":
          newProgress = Object.values(progress).reduce(
            (total, day) => total + (day.quran?.recited || 0),
            0
          );
          break;
        case "night_warrior":
          newProgress = Object.values(progress).reduce(
            (total, day) => total + (day.prayers?.qiyam || 0),
            0
          );
          break;
      }

      const wasUnlocked = achievement.unlocked;
      const nowUnlocked = newProgress >= achievement.target;

      // Show achievement popup for newly unlocked achievements
      if (!wasUnlocked && nowUnlocked) {
        setTimeout(
          () =>
            setShowAchievement({
              ...achievement,
              progress: newProgress,
              unlocked: true,
            }),
          1000
        );
        // Trigger surprise content for major achievements
        triggerSurpriseContent("achievement");
      }

      return {
        ...achievement,
        progress: newProgress,
        unlocked: nowUnlocked,
      };
    });

    setAchievements(updatedAchievements);
  }, [achievements, progress, streak, triggerSurpriseContent]);

  const getCurrentDayData = React.useCallback((): RamadanDay => {
    return (
      ramadanData.days.find((d) => d.day === currentDay) || ramadanData.days[0]
    );
  }, [currentDay]);

  // Check for special day surprises when day changes
  useEffect(() => {
    const currentDayData = getCurrentDayData();

    // Special surprise for Laylat al-Qadr nights (but only once per special night)
    if (currentDayData.specialNight) {
      const specialNightKey = `special_night_${currentDay}`;
      const hasShownForThisNight = localStorage.getItem(specialNightKey);

      if (!hasShownForThisNight) {
        // Delay to let user settle into the day
        setTimeout(() => {
          triggerSurpriseContent("special_day");
          localStorage.setItem(specialNightKey, "true");
        }, 5000);
      }
    }
  }, [currentDay, getCurrentDayData, triggerSurpriseContent]);

  // Initialize achievements
  useEffect(() => {
    setAchievements([
      {
        id: "first_week",
        title: "First Week Warrior",
        description: "Complete 7 consecutive days",
        icon: "🗡️",
        unlocked: false,
        progress: 0,
        target: 7,
      },
      {
        id: "prayer_master",
        title: "Prayer Master",
        description: "Complete all 5 prayers for 10 days",
        icon: "🕌",
        unlocked: false,
        progress: 0,
        target: 10,
      },
      {
        id: "charity_champion",
        title: "Charity Champion",
        description: "Give charity 20 times",
        icon: "💝",
        unlocked: false,
        progress: 0,
        target: 20,
      },
      {
        id: "quran_lover",
        title: "Quran Lover",
        description: "Read 100 pages of Quran",
        icon: "📖",
        unlocked: false,
        progress: 0,
        target: 100,
      },
      {
        id: "night_warrior",
        title: "Night Warrior",
        description: "Pray Qiyam 15 times",
        icon: "🌙",
        unlocked: false,
        progress: 0,
        target: 15,
      },
    ]);

    // Simulate family members
    // setFamilyMembers([
    //   {
    //     id: "1",
    //     name: "Ahmed (Brother)",
    //     currentDay: 8,
    //     streak: 8,
    //     lastActive: new Date(),
    //   },
    //   {
    //     id: "2",
    //     name: "Fatima (Sister)",
    //     currentDay: 7,
    //     streak: 6,
    //     lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000),
    //   },
    // ]);

    // Generate initial notifications
    // generateNotifications();
  }, []);

  // Load and save progress
  useEffect(() => {
    const savedProgress = localStorage.getItem("ramadanProgress");
    const savedName = localStorage.getItem("ramadanUserName");
    const savedStreak = localStorage.getItem("ramadanStreak");
    const savedSurpriseData = localStorage.getItem("ramadanSurpriseData");

    if (!savedName) setShowPledge(true);

    if (savedProgress) {
      try {
        setProgress(JSON.parse(savedProgress));
      } catch (error) {
        console.error("Error parsing saved progress:", error);
      }
    }
    if (savedName) setUserName(savedName);
    if (savedStreak) setStreak(parseInt(savedStreak));
    if (savedSurpriseData) {
      try {
        setSurpriseData(JSON.parse(savedSurpriseData));
      } catch (error) {
        console.error("Error parsing surprise data:", error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("ramadanProgress", JSON.stringify(progress));
    localStorage.setItem("ramadanStreak", streak.toString());
    localStorage.setItem("ramadanSurpriseData", JSON.stringify(surpriseData));
    if (userName) localStorage.setItem("ramadanUserName", userName);

    updateStreak();
    checkAchievements();
  }, [
    progress,
    userName,
    surpriseData,
    streak,
    updateStreak,
    checkAchievements,
  ]);

  // const generateNotifications = () => {
  //   const newNotifications: Notification[] = [
  //     {
  //       id: "1",
  //       type: "prayer",
  //       title: "Maghrib Time",
  //       message: "Perfect time to break your fast with dates! 🌴",
  //       timestamp: new Date(),
  //       read: false,
  //     },
  //     {
  //       id: "2",
  //       type: "social",
  //       title: "Family Update",
  //       message: "Ahmed completed Day 8! Send him encouragement? 👨‍👩‍👧‍👦",
  //       timestamp: new Date(Date.now() - 30 * 60 * 1000),
  //       read: false,
  //     },
  //   ];

  //   if (getCurrentDayData().specialNight) {
  //     newNotifications.push({
  //       id: "3",
  //       type: "laylat",
  //       title: "Special Night!",
  //       message:
  //         "Tonight could be Laylat al-Qadr! Perfect time for extra worship ⭐",
  //       timestamp: new Date(),
  //       read: false,
  //     });
  //   }

  //   setNotifications(newNotifications);
  // };

  // Smart surprise content logic

  const updateProgress = (
    day: number,
    category: keyof DayProgress,
    item: string | null,
    value: unknown
  ): void => {
    setProgress((prev) => {
      const oldDayProgress = prev[day] || {};
      const newProgress = {
        ...prev,
        [day]: {
          ...prev[day],
          [category]: item
            ? {
                ...(prev[day]?.[category] as Record<string, unknown>),
                [item]: value,
              }
            : value,
        },
      };

      // Mark day as completed if significant progress made
      const dayProgress = newProgress[day];
      const completionScore = calculateCompletionScore(dayProgress);
      const wasCompleted = oldDayProgress.completedAt;

      if (completionScore >= 0.7 && !dayProgress.completedAt) {
        newProgress[day].completedAt = new Date();

        // Trigger surprise for daily completion
        setTimeout(() => triggerSurpriseContent("completion"), 2000);
      }

      // Trigger surprises for specific milestones
      if (
        category === "prayers" &&
        item &&
        typeof value === "object" &&
        value !== null &&
        "fard" in value &&
        (value as Prayer).fard
      ) {
        // All 5 prayers completed for the day
        const prayerCount = Object.values(
          newProgress[day].prayers || {}
        ).filter((prayer) => typeof prayer === "object" && prayer.fard).length;

        if (prayerCount === 5) {
          setTimeout(() => triggerSurpriseContent("achievement"), 1500);
        }
      }

      // Check for streak milestones (every 5 days)
      if (!wasCompleted && newProgress[day].completedAt) {
        const consecutiveDays = calculateConsecutiveDays(newProgress, day);
        if (consecutiveDays > 0 && consecutiveDays % 5 === 0) {
          setTimeout(() => triggerSurpriseContent("streak"), 3000);
        }
      }

      return newProgress;
    });
  };

  const calculateConsecutiveDays = (
    progressData: Progress,
    fromDay: number
  ): number => {
    let consecutive = 0;
    for (let i = fromDay; i >= 1; i--) {
      if (progressData[i]?.completedAt) {
        consecutive++;
      } else {
        break;
      }
    }
    return consecutive;
  };

  const calculateCompletionScore = (dayProgress: DayProgress): number => {
    let score = 0;
    let maxScore = 0;

    // Prayer completion (30% weight)
    if (dayProgress.prayers) {
      const prayerCount = Object.values(dayProgress.prayers).filter(
        (prayer) => typeof prayer === "object" && prayer.fard
      ).length;
      score += (prayerCount / 5) * 0.3;
    }
    maxScore += 0.3;

    // Checklist completion (40% weight)
    if (dayProgress.checklist) {
      const checklistCount = Object.values(dayProgress.checklist).filter(
        Boolean
      ).length;
      score += (checklistCount / dailyChecklistItems.length) * 0.4;
    }
    maxScore += 0.4;

    // Deed completion (30% weight)
    if (dayProgress.deedCompleted) {
      score += 0.3;
    }
    maxScore += 0.3;

    return maxScore > 0 ? score / maxScore : 0;
  };

  const getDayProgress = (day: number): DayProgress => {
    return progress[day] || {};
  };

  const quickAction = (action: string) => {
    const day = currentDay;
    switch (action) {
      case "fajr":
        updateProgress(day, "prayers", "FAJR", { fard: true });
        break;
      case "charity":
        updateProgress(day, "checklist", "GAVE CHARITY", true);
        break;
      case "deed":
        updateProgress(day, "deedCompleted", null, true);
        break;
      case "dhikr":
        updateProgress(day, "checklist", "READ MY DAILY ADHKAAR", true);
        break;
    }
  };

  // const sendFamilyInvite = () => {
  //   if (inviteEmail) {
  //     // Simulate sending invite
  //     setNotifications((prev) => [
  //       ...prev,
  //       {
  //         id: Date.now().toString(),
  //         type: "social",
  //         title: "Invitation Sent",
  //         message: `Invitation sent to ${inviteEmail}! 📧`,
  //         timestamp: new Date(),
  //         read: false,
  //       },
  //     ]);
  //     setInviteEmail("");
  //     setShowFamilyInvite(false);
  //   }
  // };

  // Close dropdowns when clicking outside
  // useEffect(() => {
  //   const handleClickOutside = () => {
  //     setShowNotifications(false);
  //     // setShowMobileMenu(false);
  //   };

  //   document.addEventListener("click", handleClickOutside);
  //   return () => document.removeEventListener("click", handleClickOutside);
  // }, []);

  // Notification Bell Component - Mobile Optimized
  // const NotificationBell = () => {
  //   const unreadCount = notifications.filter((n) => !n.read).length;

  //   return (
  //     <div className="relative">
  //       <button
  //         onClick={(e) => {
  //           e.stopPropagation();
  //           setShowNotifications(!showNotifications);
  //         }}
  //         className="p-2 rounded-lg bg-white bg-opacity-20 hover:bg-opacity-30 relative min-h-[44px] min-w-[44px] flex items-center justify-center"
  //       >
  //         <Bell size={20} />
  //         {unreadCount > 0 && (
  //           <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
  //             {unreadCount}
  //           </span>
  //         )}
  //       </button>

  //       {showNotifications && (
  //         <div className="absolute right-0 top-12 w-80 max-w-[90vw] bg-white rounded-lg shadow-xl border z-50">
  //           <div className="p-4 border-b">
  //             <h3 className="font-semibold text-gray-800">Notifications</h3>
  //           </div>
  //           <div className="max-h-64 overflow-y-auto">
  //             {notifications.length === 0 ? (
  //               <p className="p-4 text-gray-500 text-center">
  //                 No new notifications
  //               </p>
  //             ) : (
  //               notifications.map((notification) => (
  //                 <div
  //                   key={notification.id}
  //                   className={`p-4 border-b hover:bg-gray-50 ${
  //                     !notification.read ? "bg-blue-50" : ""
  //                   }`}
  //                 >
  //                   <div className="flex justify-between items-start">
  //                     <div className="flex-1">
  //                       <h4 className="font-medium text-sm">
  //                         {notification.title}
  //                       </h4>
  //                       <p className="text-sm text-gray-600 mt-1">
  //                         {notification.message}
  //                       </p>
  //                       <p className="text-xs text-gray-400 mt-1">
  //                         {notification.timestamp.toLocaleTimeString()}
  //                       </p>
  //                     </div>
  //                     {!notification.read && (
  //                       <div className="w-2 h-2 bg-blue-500 rounded-full mt-1"></div>
  //                     )}
  //                   </div>
  //                 </div>
  //               ))
  //             )}
  //           </div>
  //         </div>
  //       )}
  //     </div>
  //   );
  // };

  // Quick Actions Component - Mobile Optimized
  const QuickActions = () => (
    <div className="bg-white rounded-lg p-4 shadow-md mb-6">
      <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center">
        <Zap className="mr-2" size={20} />
        Quick Actions
      </h3>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <button
          onClick={() => quickAction("fajr")}
          className="flex flex-col items-center p-4 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all transform active:scale-95 min-h-[80px]"
        >
          <span className="text-2xl mb-2">🌅</span>
          <span className="text-sm font-medium text-center">Fajr Done</span>
        </button>

        <button
          onClick={() => quickAction("charity")}
          className="flex flex-col items-center p-4 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all transform active:scale-95 min-h-[80px]"
        >
          <span className="text-2xl mb-2">💝</span>
          <span className="text-sm font-medium text-center">Give $5</span>
        </button>

        <button
          onClick={() => quickAction("dhikr")}
          className="flex flex-col items-center p-4 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all transform active:scale-95 min-h-[80px]"
        >
          <span className="text-2xl mb-2">🤲</span>
          <span className="text-sm font-medium text-center">Dhikr x33</span>
        </button>

        <button
          onClick={() => quickAction("deed")}
          className="flex flex-col items-center p-4 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all transform active:scale-95 min-h-[80px]"
        >
          <span className="text-2xl mb-2">❤️</span>
          <span className="text-sm font-medium text-center">Daily Deed</span>
        </button>
      </div>
    </div>
  );

  // Streak Display - Mobile Optimized
  // const StreakDisplay = () => (
  //   <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
  //     <div className="flex items-center space-x-2 bg-orange-100 px-3 py-1 rounded-full">
  //       <Flame className="text-orange-500" size={16} />
  //       <span className="font-bold text-orange-700 text-sm">
  //         {streak} Day Streak
  //       </span>
  //     </div>
  //     <div className="text-center sm:text-right">
  //       <div className="text-xs">Progress</div>
  //       <div className="text-sm font-bold">
  //         {Object.keys(progress).length}/30 days
  //       </div>
  //     </div>
  //   </div>
  // );

  // Achievement Popup - Mobile Optimized
  const AchievementPopup = () =>
    showAchievement && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 text-center animate-bounce">
          <div className="text-4xl mb-4">{showAchievement.icon}</div>
          <h3 className="text-xl font-bold text-yellow-600 mb-2">
            Achievement Unlocked!
          </h3>
          <h4 className="text-lg font-semibold mb-2">
            {showAchievement.title}
          </h4>
          <p className="text-gray-600 mb-4">{showAchievement.description}</p>
          <button
            onClick={() => setShowAchievement(null)}
            className="bg-yellow-500 text-white px-6 py-3 rounded-lg hover:bg-yellow-600 min-h-[44px]"
          >
            Amazing! ✨
          </button>
        </div>
      </div>
    );

  // Surprise Content Modal - Mobile Optimized
  const SurpriseModal = () =>
    todaysSurprise && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg p-6 max-w-md w-full mx-4">
          <div className="text-center mb-4">
            <Gift className="mx-auto text-yellow-600 mb-2" size={32} />
            <h3 className="text-xl font-bold text-yellow-800">
              Daily Surprise! 🎁
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              {surpriseData.dailyCount}/2 surprises today
            </p>
          </div>

          <div className="text-center">
            {todaysSurprise.type === "hadith" && (
              <div>
                <div className="text-2xl mb-3">📿</div>
                <h4 className="font-semibold text-green-800 mb-2">
                  Wisdom of the Prophet ﷺ
                </h4>
                <p className="italic text-gray-700 mb-2 text-sm sm:text-base">
                  &quot;{todaysSurprise.content}&quot;
                </p>
                <p className="text-sm text-gray-500">
                  - {todaysSurprise.source}
                </p>
              </div>
            )}
            {todaysSurprise.type === "name" && (
              <div>
                <div className="text-2xl mb-3">✨</div>
                <h4 className="font-semibold text-blue-800 mb-2">
                  Beautiful Name of Allah
                </h4>
                <p className="text-gray-700 text-sm sm:text-base">
                  {todaysSurprise.content}
                </p>
              </div>
            )}
            {todaysSurprise.type === "dua" && (
              <div>
                <div className="text-2xl mb-3">🤲</div>
                <h4 className="font-semibold text-purple-800 mb-2">
                  Special Dua
                </h4>
                <p className="text-gray-700 arabic-text text-base sm:text-lg mb-3">
                  {todaysSurprise.content}
                </p>
                {todaysSurprise.source && (
                  <p className="text-sm text-gray-600 italic">
                    &quot;{todaysSurprise.source}&quot;
                  </p>
                )}
              </div>
            )}
          </div>

          <button
            onClick={() => setTodaysSurprise(null)}
            className="w-full mt-6 bg-yellow-500 text-white py-3 rounded-lg hover:bg-yellow-600 transition-colors min-h-[44px]"
          >
            Barakallahu feeki! 🤲
          </button>
        </div>
      </div>
    );

  // Family Circle Component - Mobile Optimized
  // const FamilyCircle = () => (
  //   <div className="bg-white rounded-lg p-4 shadow-md">
  //     <div className="flex justify-between items-center mb-3">
  //       <h3 className="text-lg font-semibold text-blue-800 flex items-center">
  //         <Users className="mr-2" size={20} />
  //         Family Circle
  //       </h3>
  //       <button
  //         onClick={() => setShowFamilyInvite(true)}
  //         className="p-2 text-blue-600 hover:bg-blue-50 rounded min-h-[44px] min-w-[44px] flex items-center justify-center"
  //       >
  //         <Plus size={16} />
  //       </button>
  //     </div>

  //     <div className="space-y-2">
  //       {familyMembers.map((member) => (
  //         <div
  //           key={member.id}
  //           className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
  //         >
  //           <div>
  //             <div className="font-medium text-sm">{member.name}</div>
  //             <div className="text-xs text-gray-500">
  //               Day {member.currentDay} • {member.streak} day streak
  //             </div>
  //           </div>
  //           <button className="text-blue-600 hover:bg-blue-100 p-2 rounded min-h-[44px] min-w-[44px] flex items-center justify-center">
  //             <Send size={14} />
  //           </button>
  //         </div>
  //       ))}
  //     </div>

  //     {/* {showFamilyInvite && (
  //       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
  //         <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
  //           <div className="flex justify-between items-center mb-4">
  //             <h3 className="text-lg font-semibold">Invite Family Member</h3>
  //             <button
  //               onClick={() => setShowFamilyInvite(false)}
  //               className="p-2 hover:bg-gray-100 rounded min-h-[44px] min-w-[44px] flex items-center justify-center"
  //             >
  //               <X size={20} />
  //             </button>
  //           </div>
  //           <input
  //             type="email"
  //             placeholder="family@email.com"
  //             value={inviteEmail}
  //             onChange={(e) => setInviteEmail(e.target.value)}
  //             className="w-full p-3 border rounded-lg mb-4 text-base"
  //           />
  //           <button
  //             onClick={sendFamilyInvite}
  //             className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 min-h-[44px]"
  //           >
  //             Send Invitation
  //           </button>
  //         </div>
  //       </div>
  //     )} */}
  //   </div>
  // );

  const dayData = getCurrentDayData();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-green-100 pb-20">
      {/* Header with notifications - Mobile Optimized */}
      <div
        className={`${
          dayData.specialNight
            ? "bg-gradient-to-r from-purple-800 to-indigo-700"
            : "bg-gradient-to-r from-blue-800 to-green-700"
        } text-white p-4 sm:p-6`}
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-4">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">
              🌙 Ramadan Action Planner
              {dayData.specialNight && (
                <span className="text-yellow-300"> ⭐</span>
              )}
            </h1>
            <p className="text-blue-100 text-sm sm:text-base">
              A Daily Planner and Guide for All Ages!
            </p>
            {dayData.specialNight && (
              <div className="mt-2 bg-yellow-500 bg-opacity-20 rounded-lg p-2">
                <p className="text-yellow-200 text-xs sm:text-sm">
                  🌟 Tonight could be Laylat al-Qadr! Perfect time for extra
                  worship
                </p>
              </div>
            )}
          </div>

          {/* Mobile Header Layout */}
          <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:items-center sm:space-y-0">
            <button
              onClick={() => setShowPledge(true)}
              className="bg-white text-zinc-950 font-bold bg-opacity-20 hover:bg-opacity-30 px-4 py-3 rounded-lg transition-colors min-h-[44px]"
            >
              Read Pledge
            </button>

            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={() => setCurrentDay(Math.max(1, currentDay - 1))}
                disabled={currentDay === 1}
                className="p-3 rounded-lg bg-white text-zinc-950 bg-opacity-20 hover:bg-opacity-30 disabled:opacity-50 min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <ChevronLeft size={20} />
              </button>

              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold">
                  Day {currentDay}
                </div>
                <div className="text-xs sm:text-sm">Ramadan 1446</div>
              </div>

              <button
                onClick={() => setCurrentDay(Math.min(30, currentDay + 1))}
                disabled={currentDay === 30}
                className="p-3 rounded-lg bg-white text-zinc-950 bg-opacity-20 hover:bg-opacity-30 disabled:opacity-50 min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            {/* <div className="flex items-center justify-center space-x-2 sm:space-x-4">
              <NotificationBell />
              <StreakDisplay />
            </div> */}
          </div>
        </div>
      </div>

      {/* Daily Content - Mobile Optimized */}
      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        {/* Daily Hadith/Quote */}
        <div className="bg-white rounded-lg p-4 sm:p-6 shadow-md mb-6">
          <div className="text-center">
            <p className="text-base sm:text-lg italic text-gray-700 mb-2 leading-relaxed">
              &quot;{dayData.hadith}&quot;
            </p>
            <p className="text-sm text-gray-500">{dayData.source}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <QuickActions />

        {/* Main Content Grid - Mobile Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
          {/* Prayer Tracker - Simplified for quick actions */}
          <div className="bg-white rounded-lg p-4 shadow-md">
            <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center">
              <Moon className="mr-2" size={20} />
              PRAYERS
            </h3>
            <div className="space-y-3">
              {prayers.map((prayer) => (
                <div
                  key={prayer.name}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <span className="text-lg mr-2">{prayer.icon}</span>
                    <span className="text-sm font-medium">{prayer.name}</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={
                      getDayProgress(currentDay).prayers?.[prayer.name]?.fard ||
                      false
                    }
                    onChange={(e) =>
                      updateProgress(currentDay, "prayers", prayer.name, {
                        ...getDayProgress(currentDay).prayers?.[prayer.name],
                        fard: e.target.checked,
                      })
                    }
                    className="w-5 h-5"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Quran Tracker */}
          <div className="bg-white rounded-lg p-4 shadow-md">
            <h3 className="text-lg font-semibold text-green-800 mb-3 flex items-center">
              <BookOpen className="mr-2" size={20} />
              QURAN
            </h3>
            {/* <div className="text-sm text-blue-600 font-medium mb-3">
              {dayData.quranReading}
            </div> */}
            <div className="space-y-2">
              <div>
                <label className="block text-xs font-medium mb-1">
                  Pages Read
                </label>
                <input
                  type="number"
                  min="0"
                  value={getDayProgress(currentDay).quran?.recited || 0}
                  onChange={(e) =>
                    updateProgress(
                      currentDay,
                      "quran",
                      "recited",
                      parseInt(e.target.value) || 0
                    )
                  }
                  className="w-full px-3 py-2 border rounded text-center text-base"
                />
              </div>
            </div>
          </div>

          {/* Daily Checklist */}
          <div className="bg-white rounded-lg p-4 shadow-md">
            <h3 className="text-lg font-semibold text-purple-800 mb-3 flex items-center">
              <CheckCircle className="mr-2" size={20} />
              CHECKLIST
            </h3>
            <div className="space-y-2">
              {dailyChecklistItems.map((item, index) => (
                <label key={index} className="flex items-center text-xs">
                  <input
                    type="checkbox"
                    checked={
                      getDayProgress(currentDay).checklist?.[item] || false
                    }
                    onChange={(e) =>
                      updateProgress(
                        currentDay,
                        "checklist",
                        item,
                        e.target.checked
                      )
                    }
                    className="mr-3 w-4 h-4"
                  />
                  <span className="truncate leading-relaxed">{item}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Family Circle */}
          {/* <FamilyCircle /> */}
        </div>

        {/* Deed and Dua Section - Mobile Responsive */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
          {/* Deed of the Day */}
          <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-lg p-4 shadow-md">
            <h3 className="text-lg font-semibold text-red-800 mb-3 flex items-center">
              <Heart className="mr-2" size={20} />
              Deed of the Day
            </h3>
            <p className="text-gray-700 mb-3 text-sm sm:text-base leading-relaxed">
              {dayData.deedOfDay}
            </p>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={getDayProgress(currentDay).deedCompleted || false}
                onChange={(e) =>
                  updateProgress(
                    currentDay,
                    "deedCompleted",
                    null,
                    e.target.checked
                  )
                }
                className="mr-3 w-4 h-4"
              />
              <span className="text-sm font-medium">Completed</span>
            </label>
          </div>

          {/* Dua Section */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 shadow-md">
            <h3 className="text-lg font-semibold text-blue-800 mb-3">
              DU&apos;A OF PROPHET {dayData.dua.prophet}
            </h3>
            <div className="space-y-3">
              <div className="text-right">
                <p className="text-base sm:text-lg arabic-text text-blue-900 leading-relaxed">
                  {dayData.dua.arabic}
                </p>
              </div>
              <div>
                <p className="text-xs italic text-gray-600 leading-relaxed">
                  {dayData.dua.transliteration}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  &quot;{dayData.dua.translation}&quot;
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {dayData.dua.reference}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Goals Section */}
        <div className="bg-white rounded-lg p-4 shadow-md">
          <h3 className="text-lg font-semibold text-orange-800 mb-3 flex items-center">
            <Star className="mr-2" size={20} />
            TODAY&apos;S GOALS & REFLECTION
          </h3>
          <textarea
            placeholder="What are your intentions for today? How did you feel about your spiritual progress?"
            value={getDayProgress(currentDay).goals || ""}
            onChange={(e) =>
              updateProgress(currentDay, "goals", null, e.target.value)
            }
            className="w-full p-3 border rounded-lg h-24 resize-none text-base"
          />
        </div>
      </div>

      {/* Bottom Navigation - Mobile Optimized */}
      <div className="bg-white p-4 shadow-lg fixed bottom-0 left-0 right-0 border-t">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-start items-center space-x-2 overflow-x-auto pb-2">
            {Array.from({ length: 30 }, (_, i) => i + 1).map((day: number) => (
              <button
                key={day}
                onClick={() => setCurrentDay(day)}
                className={`min-w-[44px] h-[44px] rounded-full text-sm font-medium transition-colors flex items-center justify-center ${
                  day === currentDay
                    ? "bg-blue-600 text-white"
                    : progress[day]?.completedAt
                    ? "bg-green-200 text-green-800"
                    : day === 21 ||
                      day === 23 ||
                      day === 25 ||
                      day === 27 ||
                      day === 29
                    ? "bg-yellow-200 text-yellow-800" // Odd nights in last 10 days
                    : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Modals - Mobile Optimized */}
      {showPledge && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-4 sm:p-6 mx-4">
            <div className="text-center mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-blue-800 mb-2">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </h2>
              <p className="text-sm text-gray-600">
                IN THE NAME OF ALLAH, THE MOST GRACIOUS, THE MOST MERCIFUL
              </p>
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-blue-600 mb-4 text-center">
              {ramadanData.pledge.title}
            </h3>

            <div className="mb-4">
              <input
                type="text"
                placeholder="Enter your name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full p-3 border rounded-lg text-base"
              />
            </div>

            <div className="text-gray-700 leading-relaxed mb-6 text-sm sm:text-base">
              {ramadanData.pledge.content.replace(
                "[your name]",
                userName || "[your name]"
              )}
            </div>

            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowPledge(false)}
                className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 min-h-[44px]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <AchievementPopup />
      <SurpriseModal />

      <style jsx>{`
        .arabic-text {
          font-family: "Amiri", "Times New Roman", serif;
          line-height: 1.8;
        }

        .overflow-x-auto::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }

        button {
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default RamadanPlannerApp;
