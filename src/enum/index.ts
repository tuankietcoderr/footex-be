enum ERole {
  ADMIN = "admin",
  OWNER = "owner",
  GUEST = "guest"
}

enum EGuest {
  VISITING_GUEST = "visiting_guest",
  REGISTERED_GUEST = "registered_guest"
}

enum EFieldStatus {
  ACTIVE = "active",
  BUSY = "busy",
  MAINTAINING = "maintaining"
}

enum EBranchStatus {
  ACTIVE = "active",
  MAINTAINING = "maintaining",
  REJECTED = "rejected",
  BLOCKED = "blocked"
}

enum EFieldBookedQueueStatus {
  APPROVED = "approved",
  DECLINED = "declined"
}

enum ETeamStatus {
  ACTIVE = "active",
  BLOCKED = "blocked"
}

enum ERate {
  TEAM = "team",
  FIELD = "field",
  BRANCH = "branch"
}

enum EInvitementStatus {
  PENDING = "pending",
  APPROVED = "approved",
  DECLINED = "declined"
}

export { ERole, EGuest, EFieldStatus, EBranchStatus, EFieldBookedQueueStatus, ETeamStatus, ERate, EInvitementStatus }
