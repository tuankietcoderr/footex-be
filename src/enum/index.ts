enum ERole {
  ADMIN = "admin",
  OWNER = "owner",
  GUEST = "guest"
}

enum EFieldStatus {
  ACTIVE = "active",
  BUSY = "busy",
  MAINTAINING = "maintaining",
  DELETED = "deleted"
}

enum EBranchStatus {
  ACTIVE = "active",
  MAINTAINING = "maintaining",
  REJECTED = "rejected",
  BLOCKED = "blocked",
  DELETED = "deleted"
}

enum EFieldBookedQueueStatus {
  PENDING = "pending",
  APPROVED = "approved",
  DECLINED = "declined"
}

enum ETeamStatus {
  ACTIVE = "active",
  BLOCKED = "blocked",
  DELETED = "deleted"
}

enum ERate {
  TEAM = "teams",
  FIELD = "fields",
  BRANCH = "branches"
}

enum ECard {
  YELLOW = "yellow",
  RED = "red"
}

enum EInvitementStatus {
  PENDING = "pending",
  APPROVED = "approved",
  DECLINED = "declined"
}

enum EOwnerStatus {
  PENDING = "pending",
  ACTIVE = "active",
  BLOCKED = "blocked",
  REJECTED = "rejected",
  DELETED = "deleted"
}

enum EGuestStatus {
  ACTIVE = "active",
  BLOCKED = "blocked",
  DELETED = "deleted"
}

enum ETournamentStatus {
  ONGOING = "ongoing",
  FINISHED = "finished",
  UPCOMING = "upcoming"
}

export {
  ERole,
  EFieldStatus,
  EBranchStatus,
  EFieldBookedQueueStatus,
  ETeamStatus,
  ERate,
  EInvitementStatus,
  EOwnerStatus,
  EGuestStatus,
  ECard,
  ETournamentStatus
}
