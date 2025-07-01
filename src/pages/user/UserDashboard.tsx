import { useEffect, useState } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { Edit, Eye, EyeOff, Save, X } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { APISchemas } from "@/api/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import useUser from "@/context/auth/useUser"

// Zod schemas based on API schemas
const userUpdateSchema = z.object({
  user_name: z.string().min(1, "Username is required").max(50, "Username too long"),
  email: z.string().email("Invalid email address"),
}) satisfies z.ZodType<APISchemas["UserUpdateMe"]>

const passwordUpdateSchema = z
  .object({
    current_password: z.string().min(1, "Current password is required"),
    new_password: z.string().min(8, "Password must be at least 8 characters"),
    confirm_password: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords don't match",
    path: ["confirm_password"],
  }) satisfies z.ZodType<APISchemas["UpdatePassword"] & { confirm_password: string }>

type UserUpdateForm = z.infer<typeof userUpdateSchema>
type PasswordUpdateForm = z.infer<typeof passwordUpdateSchema>

function UserDashboard() {
  const { user, updateUser, updatePassword } = useUser()
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [isEditingPassword, setIsEditingPassword] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Profile form
  const profileForm = useForm<UserUpdateForm>({
    resolver: zodResolver(userUpdateSchema),
    defaultValues: {
      user_name: user?.user_name || "",
      email: user?.email || "",
    },
  })

  // Password form
  const passwordForm = useForm<PasswordUpdateForm>({
    resolver: zodResolver(passwordUpdateSchema),
    defaultValues: {
      current_password: "",
      new_password: "",
      confirm_password: "",
    },
  })

  // Update form values when user data changes
  useEffect(() => {
    if (user) {
      profileForm.reset({
        user_name: user.user_name || "",
        email: user.email,
      })
    }
  }, [user, profileForm])

  const onProfileSubmit = (userData: UserUpdateForm) => {
    updateUser(userData)
    setIsEditingProfile(false)
  }

  const onPasswordSubmit = (passwordData: PasswordUpdateForm) => {
    updatePassword(passwordData)
    setIsEditingPassword(false)
    passwordForm.reset()
  }

  const cancelProfileEdit = () => {
    profileForm.reset({
      user_name: user?.user_name || "",
      email: user?.email || "",
    })
    setIsEditingProfile(false)
  }

  const cancelPasswordEdit = () => {
    passwordForm.reset()
    setIsEditingPassword(false)
  }

  if (!user) {
    return (
      <Card>
        <CardContent className="p-6">
          <p>Loading user data...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Profile Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Profile Information</h2>
            <p className="text-muted-foreground">Manage your account details</p>
          </div>
          {!isEditingProfile && (
            <Button variant="outline" size="sm" onClick={() => setIsEditingProfile(true)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="user_name">Username</Label>
                {isEditingProfile ? (
                  <div>
                    <Input
                      id="user_name"
                      {...profileForm.register("user_name")}
                      className={profileForm.formState.errors.user_name ? "border-destructive" : ""}
                    />
                    {profileForm.formState.errors.user_name && (
                      <p className="text-destructive mt-1 text-sm">
                        {profileForm.formState.errors.user_name.message}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-lg font-semibold">{user.user_name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                {isEditingProfile ? (
                  <div>
                    <Input
                      id="email"
                      type="email"
                      {...profileForm.register("email")}
                      className={profileForm.formState.errors.email ? "border-destructive" : ""}
                    />
                    {profileForm.formState.errors.email && (
                      <p className="text-destructive mt-1 text-sm">
                        {profileForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-lg font-semibold">{user.email}</p>
                )}
              </div>
            </div>

            {isEditingProfile && (
              <div className="flex gap-2 pt-4">
                <Button type="submit" size="sm">
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={cancelProfileEdit}>
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Password Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Password</h2>
            <p className="text-muted-foreground">Update your password</p>
          </div>
          {!isEditingPassword && (
            <Button variant="outline" size="sm" onClick={() => setIsEditingPassword(true)}>
              <Edit className="mr-2 h-4 w-4" />
              Change Password
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {!isEditingPassword ? (
            <div className="space-y-2">
              <Label>Current Password</Label>
              <p className="text-lg font-semibold">••••••••••</p>
            </div>
          ) : (
            <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current_password">Current Password</Label>
                <div className="relative">
                  <Input
                    id="current_password"
                    type={showCurrentPassword ? "text" : "password"}
                    {...passwordForm.register("current_password")}
                    className={
                      passwordForm.formState.errors.current_password
                        ? "border-destructive pr-10"
                        : "pr-10"
                    }
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute top-0 right-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {passwordForm.formState.errors.current_password && (
                  <p className="text-destructive text-sm">
                    {passwordForm.formState.errors.current_password.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="new_password">New Password</Label>
                <div className="relative">
                  <Input
                    id="new_password"
                    type={showNewPassword ? "text" : "password"}
                    {...passwordForm.register("new_password")}
                    className={
                      passwordForm.formState.errors.new_password
                        ? "border-destructive pr-10"
                        : "pr-10"
                    }
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute top-0 right-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {passwordForm.formState.errors.new_password && (
                  <p className="text-destructive text-sm">
                    {passwordForm.formState.errors.new_password.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm_password">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="confirm_password"
                    type={showConfirmPassword ? "text" : "password"}
                    {...passwordForm.register("confirm_password")}
                    className={
                      passwordForm.formState.errors.confirm_password
                        ? "border-destructive pr-10"
                        : "pr-10"
                    }
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute top-0 right-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {passwordForm.formState.errors.confirm_password && (
                  <p className="text-destructive text-sm">
                    {passwordForm.formState.errors.confirm_password.message}
                  </p>
                )}
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" size="sm">
                  <Save className="mr-2 h-4 w-4" />
                  Update Password
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={cancelPasswordEdit}>
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default UserDashboard
