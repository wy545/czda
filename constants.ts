import { ArchiveItem, Notification, UserProfile } from './types';

export const CURRENT_USER: UserProfile = {
  name: "刘",
  studentId: "23108103",
  avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDu8zbnLMWnAN-qYQbgxYxwtt4oKy7zJmXWsrLaa-QBUPCZ7OPNeRU4nmK1vl1ujoRmtVvVMW832KGD4xbg7mIjaLPOCcSH9n_H2IJdPMs0AcTjoYGTtoiunromaxLJDIHTk0D1rsBNCvJIndknqoSlFvaxWWDsnYZQELakICSgPMApFM07uga_9jFe9_oq1fDMZEv5S0BAlQHJpBcdx_Pzmp3Z1FHT9btcPj_wucCP-SSin7rMo6FmHThyta3DGI2ZthzdGhV8xwsJ",
  grade: "大三",
  major: "电子信息工程",
  university: "平顶山学院"
};

export const ARCHIVE_ITEMS: ArchiveItem[] = [
  {
    id: "1",
    title: "Python 进阶认证",
    category: "证书认证",
    organization: "Coursera",
    date: "2023-06-12",
    status: "approved",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuArS-R_Dwsyhw8uNp9UIzxH1feMqSbW3sJtRg0_N6ra2oq_cSlsbMvcM2PtheM0Qz0AQvIqKfr41C3N7l9wJ4nrvT8DHDvu51sZ-bGGDpNC3xOpigWTzob9zkuTpLLMtdbIL4qtqx7CHF0gOfz1Eyp1EojW1LmXJk21-3_7ZrOpvxf0KVtwvhS8U7SuLoeEFnQD8mLR4VZhPFhL4v1QKILxko85Sf52t6cuYdkBU671SMrqMByk6kgP-wbemGGi8J9lQTG-ALZ1V4Hg",
    description: "此证书由 Coursera 颁发，涵盖了 Python 高级数据结构、装饰器、生成器以及异步编程等核心内容。通过为期三个月的课程学习，我成功完成了最终的综合实战项目。"
  },
  {
    id: "2",
    title: "院长嘉许名单",
    category: "奖惩记录",
    organization: "大学本部",
    date: "2023-05-20",
    status: "approved",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBe6z0j992dGzFoAGk6qR5brH1GWM5hYcyeobIioC2V7pFjd-d3RHmhY1m0e-2Y_87r3Y-E2Dmjv5Apqybg3MTBbk0eG2L9XywBSf9vTlflo00VTNudBuuLd8kLruldjW8O7dQxmG9e5c7FKa6sM1_0GV_k1klH1v_jUMjsJdRg1uoryeqOMxGmvVVb1jYCoTZRPuL_Fdh2-YkkUwDwFxgadpjoygQHBgYpqZjwrfWkT8tZ6CzqA3_K-sDmcWUQEnP_dwxNWoRs7s01"
  },
  {
    id: "3",
    title: "2023 黑客松优胜奖",
    category: "社会实践",
    organization: "TechCrunch",
    date: "2023-04-15",
    status: "pending",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBRa4qSB_1kENpxqXpBXQ7eCO9q9WVSGps5IZJUJ7bYMT4CXxDhxYTPeeAwr6HlYiUPtmaSdInZiVabS4pM5mrSBaheCG6bicqVO1Xqz18hCgK9q0XZc7Y-S0btDsiVhv0nwUIUPnsRlbYwREMw9qKwcGsvnqjwfafKE0tdk_sQJ-Ogsu03qwf4EfigFmR3sP0ZAgQaluqhgkeLbPHiKSWrTatsmjuQYztniAlHNPRbdREC1_vX5ghYqi13xAHJefH6nQHYgjFBxJ_J"
  },
  {
    id: "4",
    title: "数据科学研讨会",
    category: "学术活动",
    organization: "General Assembly",
    date: "2023-03-05",
    status: "approved",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCVoXriFEDHf_kiWFoOORUNaknIvoubHYHFWWlWk5HJohljTz1g_9m2RUoCYtFusoCy6gP2HOVI-GYvGp4bv-e83K032u696CyFAXwk4f68-4EMeRVTWN1xWj2Fj9MbMt00waVTSSbmO-LC0BdZJKR9PuKjJZofhK_dRp6cUXhQzLrJwtzkyLvVwA-uyzEjun2e4DPKZP0v6ybdbAVFe6WAZqffC2eSzZ-kDaLBVR1qlmU-28T1R3XbFKfWNJUAkdKQxSZtPH8OT7_W"
  }
];

export const NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    type: "certificate",
    title: "新增证书",
    description: "您的“Python入门”证书已成功归档，现在可以在您的个人资料中查看。",
    time: "2分钟前",
    read: false,
    group: "today"
  },
  {
    id: "2",
    type: "status",
    title: "申请状态更新",
    description: "您的“暑期实习”申请目前正在由学院委员会审核。",
    time: "1小时前",
    read: false,
    group: "today"
  },
  {
    id: "3",
    type: "milestone",
    title: "成长积分里程碑",
    description: "恭喜！本学期您的成长积分已达到 500 分。",
    time: "3小时前",
    read: true,
    group: "today"
  },
  {
    id: "4",
    type: "alert",
    title: "成长数据已删除",
    description: "按照您的请求，条目“2022年志愿服务”已从您的时间轴中移除。",
    time: "昨天",
    read: true,
    group: "yesterday"
  },
  {
    id: "5",
    type: "system",
    title: "系统维护通知",
    description: "档案系统将于今晚 12:00 进行短暂的例行维护。",
    time: "昨天",
    read: true,
    group: "yesterday"
  }
];

export const CHART_DATA = [
  { name: '9月', score: 30 },
  { name: '10月', score: 45 },
  { name: '11月', score: 55 },
  { name: '12月', score: 85 },
  { name: '1月', score: 90 },
];

export const RADAR_DATA = [
  { subject: '学业成绩', A: 92, fullMark: 100 },
  { subject: '社会实践', A: 85, fullMark: 100 },
  { subject: '创新创业', A: 78, fullMark: 100 },
  { subject: '文体素养', A: 88, fullMark: 100 },
  { subject: '志愿服务', A: 95, fullMark: 100 },
];