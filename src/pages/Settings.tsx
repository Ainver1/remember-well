import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Palette, Mic, Camera, FolderOpen, Bell } from "lucide-react";

const Settings = () => {
  const { toast } = useToast();
  const [darkMode, setDarkMode] = useState(false);
  const [theme, setTheme] = useState("default");
  const [permissions, setPermissions] = useState({
    microphone: false,
    camera: false,
    storage: false,
    notifications: false,
  });

  useEffect(() => {
    // Check current theme
    const isDark = document.documentElement.classList.contains('dark');
    setDarkMode(isDark);
    
    // Check permissions
    checkPermissions();
  }, []);

  const checkPermissions = async () => {
    try {
      // Check microphone permission
      const micPermission = await navigator.permissions.query({ name: 'microphone' as PermissionName });
      
      // Check camera permission  
      const cameraPermission = await navigator.permissions.query({ name: 'camera' as PermissionName });
      
      // Check notification permission
      const notificationPermission = await navigator.permissions.query({ name: 'notifications' as PermissionName });

      setPermissions({
        microphone: micPermission.state === 'granted',
        camera: cameraPermission.state === 'granted',
        storage: true, // IndexedDB doesn't require permission
        notifications: notificationPermission.state === 'granted',
      });
    } catch (error) {
      console.log('Permission check not supported');
    }
  };

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
    toast({
      title: `${newMode ? 'Dark' : 'Light'} mode enabled`,
      description: "Your theme preference has been saved",
    });
  };

  const requestPermission = async (type: string) => {
    try {
      switch (type) {
        case 'microphone':
          const micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
          micStream.getTracks().forEach(track => track.stop());
          setPermissions(prev => ({ ...prev, microphone: true }));
          toast({ title: "Microphone access granted" });
          break;
          
        case 'camera':
          const camStream = await navigator.mediaDevices.getUserMedia({ video: true });
          camStream.getTracks().forEach(track => track.stop());
          setPermissions(prev => ({ ...prev, camera: true }));
          toast({ title: "Camera access granted" });
          break;
          
        case 'notifications':
          const permission = await Notification.requestPermission();
          setPermissions(prev => ({ ...prev, notifications: permission === 'granted' }));
          toast({ title: permission === 'granted' ? "Notifications enabled" : "Notifications denied" });
          break;
      }
    } catch (error) {
      toast({
        title: "Permission denied",
        description: `Could not access ${type}. Please check your browser settings.`,
        variant: "destructive"
      });
    }
  };

  const clearData = () => {
    if (confirm('Are you sure you want to delete all your memories? This cannot be undone.')) {
      // Clear IndexedDB
      indexedDB.deleteDatabase('MemoryKeeperDB');
      toast({
        title: "Data cleared",
        description: "All memories have been deleted from this device",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto px-4 pt-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Customize your app experience</p>
        </div>

        <div className="space-y-6">
          {/* Appearance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Appearance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="dark-mode">Dark mode</Label>
                <Switch
                  id="dark-mode"
                  checked={darkMode}
                  onCheckedChange={toggleDarkMode}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Theme color</Label>
                <Select value={theme} onValueChange={setTheme}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default (Purple)</SelectItem>
                    <SelectItem value="blue">Blue</SelectItem>
                    <SelectItem value="green">Green</SelectItem>
                    <SelectItem value="orange">Orange</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Permissions */}
          <Card>
            <CardHeader>
              <CardTitle>Device Permissions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mic className="h-4 w-4" />
                  <Label>Microphone</Label>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded ${permissions.microphone ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {permissions.microphone ? 'Granted' : 'Denied'}
                  </span>
                  {!permissions.microphone && (
                    <Button size="sm" variant="outline" onClick={() => requestPermission('microphone')}>
                      Enable
                    </Button>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Camera className="h-4 w-4" />
                  <Label>Camera</Label>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded ${permissions.camera ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {permissions.camera ? 'Granted' : 'Denied'}
                  </span>
                  {!permissions.camera && (
                    <Button size="sm" variant="outline" onClick={() => requestPermission('camera')}>
                      Enable
                    </Button>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FolderOpen className="h-4 w-4" />
                  <Label>Local Storage</Label>
                </div>
                <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-700">
                  Enabled
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  <Label>Notifications</Label>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded ${permissions.notifications ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {permissions.notifications ? 'Granted' : 'Denied'}
                  </span>
                  {!permissions.notifications && (
                    <Button size="sm" variant="outline" onClick={() => requestPermission('notifications')}>
                      Enable
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Management */}
          <Card>
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Export Data</Label>
                <p className="text-sm text-muted-foreground">Download all your memories as a backup file</p>
                <Button variant="outline" className="w-full">
                  Export Memories
                </Button>
              </div>
              
              <div className="space-y-2">
                <Label>Clear All Data</Label>
                <p className="text-sm text-muted-foreground">Permanently delete all memories from this device</p>
                <Button variant="destructive" onClick={clearData} className="w-full">
                  Delete All Memories
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* About */}
          <Card>
            <CardHeader>
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>Life Memory Keeper v1.0</p>
                <p>Built with privacy in mind - all data stays on your device</p>
                <p>Open source and available on GitHub</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;