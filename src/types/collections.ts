// src/types/collections.ts

export type UserType = 'superadmin' | 'coach' | 'user'
export type StepStatus = 'pending' | 'inProgress' | 'done' | 'skipped'
export type ContentType = 'video' | 'article' | 'page' | 'roadmap' | 'link' | 'guide'

// -----------------------
// Collection: user
// -----------------------
export type User = {
  id: string
  username: string
  email: string
  password: string
  type: UserType
  profilePicture: string
  createdAt: string
  updatedAt: string
  lastLogin: string
  Bookmarks: string[]
  RoadmapsStarted: string[]
  RoadmapsCreated: string[]
  StepsCreated: string[]
  ContentsCreated: string[]
  GuidesCreated: string[]
  AttachmentsCreated: string[]
  Comments: string[]
}

// -----------------------
// Collection: roadmap
// -----------------------
export type Roadmap = {
  id: string
  title: string
  subTitle: string
  cover: string
  description: string
  published: boolean
  premium: boolean
  viewsPerDay: number
  viewsPerWeek: number
  viewsPerMonth: number
  totalViews: number
  createdAt: string
  updatedAt: string
  Games: string[]
  Steps: string[]
  Tags: string[]
  Comments: string[]
  CreatedBy: string
  UpdatedBy: string
}

// -----------------------
// Collection: step
// -----------------------
export type Step = {
  id: string
  title: string
  subTitle: string
  description: string
  createdAt: string
  updatedAt: string
  Roadmaps: string[]
  Contents: string[]
  PreviousSteps: string[]
  NextSteps: string[]
  CreatedBy: string
  UpdatedBy: string
}

// -----------------------
// Collection: content
// -----------------------
export type Content = {
  id: string
  title: string
  type: ContentType
  link: string
  createdAt: string
  updatedAt: string
  Steps: string[]
  CreatedBy: string
  UpdatedBy: string
}

// -----------------------
// Collection: progression
// -----------------------
export type Progression = {
  id: string
  User: string
  Roadmap: string
  Step: string
  status: StepStatus
  updatedAt: string
}

// -----------------------
// Collection: tag
// -----------------------
export type Tag = {
  id: string
  name: string
  createdAt: string
  updatedAt: string
  CreatedBy: string
  UpdatedBy: string
}

// -----------------------
// Collection: game
// -----------------------
export type Game = {
  id: string
  title: string
  subTitle: string
  cover: string
  description: string
  createdAt: string
  updatedAt: string
  viewsPerDay: number
  viewsPerWeek: number
  viewsPerMonth: number
  totalViews: number
  Roadmaps: string[]
  CreatedBy: string
  UpdatedBy: string
}

// -----------------------
// Collection: comment
// -----------------------
export type Comment = {
  id: string
  message: string
  createdAt: string
  updatedAt: string
  Responses: string[]
  Roadmap: string
  User: string
  CreatedBy: string
  UpdatedBy: string
}

// -----------------------
// Collection: guide
// -----------------------
export type Guide = {
  id: string
  Attachments: string[]
  Tags: string[]
  Comments: string[]
  Likes: string[]
  Views: string[]
  Game: string
  title: string
  subTitle: string
  description: string
  content: string
  cover: string
  difficulty: string
  estimatedReadTime: number
  published: boolean
  premium: boolean
  version: string
  language: string
  viewsCount: number
  likesCount: number
  commentsCount: number
  lastViewedAt: string
  publishedAt: string
  CreatedBy: string
  UpdatedBy: string
}

// -----------------------
// Collection: attachment
// -----------------------
export type Attachment = {
  id: string
  Guides: string[]
  fileName: string
  url: string
  alt: string
  caption: string
  type: string
  CreatedBy: string
  UpdatedBy: string
}
