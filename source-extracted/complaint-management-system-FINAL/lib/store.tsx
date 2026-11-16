"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import type {
  User,
  Operation,
  FieldReport,
  ComplaintBox,
  Analysis,
  FollowUp,
  StockMovement,
  StockRequest,
  Responder,
} from "@/lib/types"
import {
  SEED_USERS,
  SEED_OPERATIONS,
  SEED_FIELD_REPORTS,
  SEED_BOXES,
  SEED_ANALYSES,
  SEED_FOLLOWS,
  SEED_STOCK,
  SEED_STOCK_REQUESTS,
  SEED_RESPONDERS,
} from "@/lib/data/seed"
import { BRANCHES, STATUS } from "@/lib/data/constants"

const STORAGE_KEY = "sfd-complaints-v1"
const SESSION_KEY = "sfd-session-v1"

interface DataState {
  users: User[]
  operations: Operation[]
  fieldReports: FieldReport[]
  boxes: ComplaintBox[]
  analyses: Analysis[]
  follows: FollowUp[]
  stock: StockMovement[]
  stockRequests: StockRequest[]
  responders: Responder[]
}

const initialData: DataState = {
  users: SEED_USERS,
  operations: SEED_OPERATIONS,
  fieldReports: SEED_FIELD_REPORTS,
  boxes: SEED_BOXES,
  analyses: SEED_ANALYSES,
  follows: SEED_FOLLOWS,
  stock: SEED_STOCK,
  stockRequests: SEED_STOCK_REQUESTS,
  responders: SEED_RESPONDERS,
}

interface StoreContextValue extends DataState {
  ready: boolean
  currentUser: User | null
  isAdmin: boolean
  branchName: string
  login: (username: string, password: string) => { ok: boolean; error?: string }
  logout: () => void
  changePassword: (oldPass: string, newPass: string) => { ok: boolean; error?: string }
  // scoped views (respect branch unless admin)
  scopedOperations: Operation[]
  // actions
  addOperation: (op: Partial<Operation> & { type: Operation["type"] }) => Operation
  updateOperation: (id: string, patch: Partial<Operation>) => void
  addFieldReport: (r: Omit<FieldReport, "id" | "activityNo" | "createdAt" | "branch">) => void
  addBox: (b: Omit<ComplaintBox, "id" | "recordNo" | "createdAt" | "branch">) => void
  addAnalysis: (a: Omit<Analysis, "id" | "analysisNo" | "createdAt" | "branch">) => void
  addFollow: (f: Omit<FollowUp, "id" | "followNo" | "createdAt" | "branch">) => void
  addStock: (s: Omit<StockMovement, "id" | "createdAt" | "branch">) => void
  addStockRequest: (s: Omit<StockRequest, "id" | "requestNo" | "createdAt" | "branch" | "status">) => void
  addUser: (u: Omit<User, "active">) => { ok: boolean; error?: string }
  toggleUser: (username: string) => void
}

const StoreContext = createContext<StoreContextValue | null>(null)

function loadData(): DataState {
  if (typeof window === "undefined") return initialData
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return initialData
    const parsed = JSON.parse(raw)
    return { ...initialData, ...parsed }
  } catch {
    return initialData
  }
}

function pad(n: number, len = 4) {
  return String(n).padStart(len, "0")
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<DataState>(initialData)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [ready, setReady] = useState(false)

  // hydrate from localStorage on client
  useEffect(() => {
    const d = loadData()
    setData(d)
    try {
      const session = window.localStorage.getItem(SESSION_KEY)
      if (session) {
        const username = JSON.parse(session)?.username
        const user = d.users.find((u) => u.username === username && u.active)
        if (user) setCurrentUser(user)
      }
    } catch {
      /* ignore */
    }
    setReady(true)
  }, [])

  // persist data
  useEffect(() => {
    if (!ready) return
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch {
      /* ignore quota */
    }
  }, [data, ready])

  const isAdmin = currentUser?.role === "مدير النظام" || currentUser?.branch === "الإدارة العامة"

  const branchName = currentUser?.branch ?? ""

  const branchProvince = useMemo(() => {
    const b = Object.values(BRANCHES).find((x) => x.name === branchName)
    return b?.fixedProvince
  }, [branchName])

  const login = useCallback(
    (username: string, password: string) => {
      const u = username.trim()
      if (!u) return { ok: false, error: "يرجى إدخال اسم المستخدم." }
      if (!password) return { ok: false, error: "يرجى إدخال كلمة المرور." }
      const user = data.users.find((x) => x.username === u)
      if (!user || user.password !== password)
        return { ok: false, error: "اسم المستخدم أو كلمة المرور غير صحيحة." }
      if (!user.active) return { ok: false, error: "هذا المستخدم موقوف ولا يمكنه الدخول." }
      setCurrentUser(user)
      try {
        window.localStorage.setItem(SESSION_KEY, JSON.stringify({ username: user.username }))
      } catch {
        /* ignore */
      }
      return { ok: true }
    },
    [data.users],
  )

  const logout = useCallback(() => {
    setCurrentUser(null)
    try {
      window.localStorage.removeItem(SESSION_KEY)
    } catch {
      /* ignore */
    }
  }, [])

  const changePassword = useCallback(
    (oldPass: string, newPass: string) => {
      if (!currentUser) return { ok: false, error: "لا توجد جلسة." }
      if (currentUser.password !== oldPass)
        return { ok: false, error: "كلمة المرور الحالية غير صحيحة." }
      if (newPass.length < 8 || !/[A-Za-z]/.test(newPass) || !/[0-9]/.test(newPass))
        return { ok: false, error: "كلمة المرور يجب أن تكون 8 خانات على الأقل وتحتوي حروفًا وأرقامًا." }
      setData((d) => ({
        ...d,
        users: d.users.map((u) =>
          u.username === currentUser.username ? { ...u, password: newPass } : u,
        ),
      }))
      setCurrentUser((u) => (u ? { ...u, password: newPass } : u))
      return { ok: true }
    },
    [currentUser],
  )

  const scopedOperations = useMemo(() => {
    if (isAdmin) return data.operations
    return data.operations.filter((o) => o.branch === branchName)
  }, [data.operations, isAdmin, branchName])

  const addOperation = useCallback<StoreContextValue["addOperation"]>(
    (op) => {
      const seq = data.operations.length + 1
      const stamp = new Date()
      const yymm = `${String(stamp.getFullYear()).slice(2)}${pad(stamp.getMonth() + 1, 2)}`
      const nowIso = stamp.toISOString()
      const newOp: Operation = {
        id: `op-${Date.now()}`,
        operationNo: `OP-${yymm}-${pad(seq)}`,
        status: STATUS.NEW,
        branch: branchName,
        channel: "", phone: "", name: "", gender: "", capacity: "",
        province: branchProvince ?? "", subject: "", description: "", attachments: [],
        createdAt: nowIso, updatedAt: nowIso,
        ...op,
      }
      setData((d) => ({ ...d, operations: [newOp, ...d.operations] }))
      return newOp
    },
    [data.operations.length, branchName, branchProvince],
  )

  const updateOperation = useCallback<StoreContextValue["updateOperation"]>((id, patch) => {
    setData((d) => ({
      ...d,
      operations: d.operations.map((o) =>
        o.id === id ? { ...o, ...patch, updatedAt: new Date().toISOString() } : o,
      ),
    }))
  }, [])

  const addFieldReport = useCallback<StoreContextValue["addFieldReport"]>(
    (r) => {
      setData((d) => ({
        ...d,
        fieldReports: [
          {
            ...r,
            id: `f-${Date.now()}`,
            activityNo: `FLD-${pad(d.fieldReports.length + 1)}`,
            branch: branchName,
            createdAt: new Date().toISOString(),
          },
          ...d.fieldReports,
        ],
      }))
    },
    [branchName],
  )

  const addBox = useCallback<StoreContextValue["addBox"]>(
    (b) => {
      setData((d) => ({
        ...d,
        boxes: [
          {
            ...b,
            id: `b-${Date.now()}`,
            recordNo: `BOX-${pad(d.boxes.length + 1)}`,
            branch: branchName,
            createdAt: new Date().toISOString(),
          },
          ...d.boxes,
        ],
      }))
    },
    [branchName],
  )

  const addAnalysis = useCallback<StoreContextValue["addAnalysis"]>(
    (a) => {
      setData((d) => ({
        ...d,
        analyses: [
          {
            ...a,
            id: `a-${Date.now()}`,
            analysisNo: `AN-${pad(d.analyses.length + 1)}`,
            branch: branchName,
            createdAt: new Date().toISOString(),
          },
          ...d.analyses,
        ],
      }))
    },
    [branchName],
  )

  const addFollow = useCallback<StoreContextValue["addFollow"]>(
    (f) => {
      setData((d) => ({
        ...d,
        follows: [
          {
            ...f,
            id: `fo-${Date.now()}`,
            followNo: `FU-${pad(d.follows.length + 1)}`,
            branch: branchName,
            createdAt: new Date().toISOString(),
          },
          ...d.follows,
        ],
      }))
    },
    [branchName],
  )

  const addStock = useCallback<StoreContextValue["addStock"]>(
    (s) => {
      setData((d) => ({
        ...d,
        stock: [
          { ...s, id: `s-${Date.now()}`, branch: branchName, createdAt: new Date().toISOString() },
          ...d.stock,
        ],
      }))
    },
    [branchName],
  )

  const addStockRequest = useCallback<StoreContextValue["addStockRequest"]>(
    (s) => {
      setData((d) => ({
        ...d,
        stockRequests: [
          {
            ...s,
            id: `sr-${Date.now()}`,
            requestNo: `REQ-${pad(d.stockRequests.length + 1)}`,
            branch: branchName,
            status: "قيد المراجعة",
            createdAt: new Date().toISOString(),
          },
          ...d.stockRequests,
        ],
      }))
    },
    [branchName],
  )

  const addUser = useCallback<StoreContextValue["addUser"]>(
    (u) => {
      if (data.users.some((x) => x.username === u.username))
        return { ok: false, error: "اسم المستخدم موجود مسبقًا." }
      setData((d) => ({ ...d, users: [...d.users, { ...u, active: true }] }))
      return { ok: true }
    },
    [data.users],
  )

  const toggleUser = useCallback<StoreContextValue["toggleUser"]>((username) => {
    setData((d) => ({
      ...d,
      users: d.users.map((u) => (u.username === username ? { ...u, active: !u.active } : u)),
    }))
  }, [])

  const value: StoreContextValue = {
    ...data,
    ready,
    currentUser,
    isAdmin,
    branchName,
    login,
    logout,
    changePassword,
    scopedOperations,
    addOperation,
    updateOperation,
    addFieldReport,
    addBox,
    addAnalysis,
    addFollow,
    addStock,
    addStockRequest,
    addUser,
    toggleUser,
  }

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error("useStore must be used within StoreProvider")
  return ctx
}
