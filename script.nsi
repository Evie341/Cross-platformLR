!include MUI2.nsh

!define MUI_ABORTWARNING

!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_COMPONENTS
!insertmacro MUI_PAGE_INSTFILES

!define MUI_FINISHPAGE_RUN "$INSTDIR\MyApp.exe"
!define MUI_FINISHPAGE_SHOWREADME "$INSTDIR\Readme.txt"
!define MUI_FINISHPAGE_LINK "Visit MyApp Website"
!define MUI_FINISHPAGE_LINK_LOCATION "http://www.myapp.com"
!insertmacro MUI_PAGE_FINISH

!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES

!insertmacro MUI_LANGUAGE "English"

Section "Install"
  SetOutPath $INSTDIR
  WriteUninstaller "$INSTDIR\Uninstall MyApp.exe"
SectionEnd

Section "Desktop shortcut"
  SetOutPath $INSTDIR
  CreateShortCut "$DESKTOP\MyApp.lnk" "$INSTDIR\MyApp.exe"
SectionEnd

Section "Start menu shortcut"
  CreateDirectory $SMPROGRAMS\MyApp
  CreateShortCut "$SMPROGRAMS\MyApp\MyApp.lnk" "$INSTDIR\MyApp.exe"
  CreateShortCut "$SMPROGRAMS\MyApp\Uninstall MyApp.lnk" "$INSTDIR\Uninstall MyApp.exe"
SectionEnd
