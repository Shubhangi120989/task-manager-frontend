import { Excalidraw, MainMenu, WelcomeScreen } from "@excalidraw/excalidraw";
import { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";
import { setBoardData,getBoardData} from "../apis/task";
import { useParams } from "react-router-dom";
// import debounce from "lodash/debounce";
// import useDeepCompareEffect from "use-deep-compare-effect";
// import { toast } from "sonner";
import { Button, 
    // Progress, 
    Skeleton, Spinner } from "@nextui-org/react";
import React from "react";
// import { set } from "lodash";
import { toast } from "sonner";
// const decompressBrotli = (compressedData: string): string => {
//     const compressedBytes = Uint8Array.from(atob(compressedData), (c) => c.charCodeAt(0));
//     const decompressedBytes = BrotliDecode(compressedBytes); // You need to implement or use a library for Brotli decompression
//     return new TextDecoder().decode(decompressedBytes);
// };
const Canvas = () => {
    const params = useParams(); // Fixed typo from 'prams' to 'params'
    const taskId = params.taskId;
    console.log(taskId)
    const [whiteBoard, setWhiteBoard] = React.useState<
        readonly ExcalidrawElement[] | null
    >([]);
    const [initialData, setInitialData] = React.useState<string | null>(null);
    const [loading,setLoading] = React.useState<boolean>(true);
    const [saveLoading, setSaveLoading] = React.useState<boolean>(false);

      React.useEffect(() => {
        if (!taskId) return;
        const fetchBoardData = async () => {
            const data= await getBoardData(taskId);
            // const decodedData = atob(data); // Decode Base64
            // const decompressedData = decompressBrotli(decodedData); // Decompress using Brotli
            setInitialData(data);
            setLoading(false);
        };
        fetchBoardData();
    }, [taskId]);

    const saveData =async () => {
        if (!taskId) return;
        setSaveLoading(()=>true);
        const finalElements = whiteBoard?.filter((element: ExcalidrawElement) => !element.isDeleted);
        if (!finalElements) return;
        try {
                const finalElementsString = JSON.stringify(finalElements);
                await setBoardData(taskId, finalElementsString);
                toast.success("Board saved successfully.");
                
        //   toast.success("Board saved successfully.");
        } catch (error) {
                console.error("Error saving board data:", error);
                toast.error("Failed to save board data: " + (error as any).message);
        }
        setSaveLoading(()=>false);
    };

    // const debouncedSaveData = React.useCallback(debounce(saveData, 1000), [saveData]);

    // useDeepCompareEffect(() => {
    //     debouncedSaveData();
    //     return () => {
    //         debouncedSaveData.cancel();
    //     };
    // }, [debouncedSaveData, whiteBoard]); 

    const handleKeyDown = React.useCallback(
        (event: KeyboardEvent) => {
            const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
            const isSaveShortcut = isMac
                ? event.metaKey && event.key === "s"
                : event.ctrlKey && event.key === "s";

            if (isSaveShortcut) {
                event.preventDefault();
                saveData(); 
            }
        },
        [saveData]
    );

    React.useEffect(() => {
        // Attach the event listener
        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [handleKeyDown]);

    // const handleGenerateLink = React.useCallback(
    //     async (access: 'view' | 'edit') => {
    //         if (!taskId) {
    //             // toast.error("Task ID is missing.");
    //             return;
    //         }
    //         console.log("access", access);

    //         // try {
    //         //   const expiresIn = 24; // Link expires in 24 hours
    //         //   const link = await generatePublicLink(taskId, access, expiresIn);
    //         //   navigator.clipboard.writeText(link)
    //         //     .then(() => {
    //         //       toast.success(`${access === "view" ? "View" : "Edit"} link copied to clipboard!`);
    //         //       setPublicLink(link);
    //         //     })
    //         //     .catch((err) => {
    //         //       console.error("Failed to copy link: ", err);
    //         //       toast.error("Failed to copy link.");
    //         //     });
    //         // } catch (error) {
    //         //   console.error("Error generating link:", error);
    //         //   toast.error("Failed to generate link.");
    //         // }
    //     },
    //     [taskId]
    // );
    if(loading){
        return <Skeleton style={{ height: "93vh", position: "relative" }}>Loading...</Skeleton>
    }

    return (
        <>
        {/* {saveLoading&&<Progress isIndeterminate aria-label="Loading..." className="fixed top-0 left-0 w-full z-50" size="sm" />} */}
        <div id="whiteboard" style={{ height: "93vh", position: "relative" }}>
            <Excalidraw
                theme="dark"
                initialData={
                    initialData
                        ? {
                              elements: typeof initialData === "string" ? JSON.parse(initialData) : initialData,
                          }
                        : undefined
                }
                UIOptions={{
                    canvasActions: {
                        export: false,
                        loadScene: false,
                        saveAsImage: true,
                    },
                }}
                onChange={(excaliDrawElements) => {
                    setWhiteBoard(excaliDrawElements);
                }}
            >
                <MainMenu>
                    <MainMenu.DefaultItems.SaveAsImage />
                    <MainMenu.DefaultItems.ClearCanvas />
                    <MainMenu.DefaultItems.Help />
                    {/* <MainMenu.ItemCustom>
                        <Button size="sm" onPress={() => handleGenerateLink("view")}>
                            Get Public View Link
                        </Button>
                        <Button size="sm" onPress={() => handleGenerateLink("edit")}>
                            Get Public Edit Link
                        </Button>
                    </MainMenu.ItemCustom> */}
                    <MainMenu.DefaultItems.ChangeCanvasBackground />
                </MainMenu>
                <WelcomeScreen>
                    <WelcomeScreen.Hints.MenuHint />
                    <WelcomeScreen.Hints.ToolbarHint />
                    <WelcomeScreen.Hints.HelpHint />
                </WelcomeScreen>
            </Excalidraw>
        </div>
    <div style={{ position: "absolute", bottom: 40, right: 40, zIndex: 100 }}>
        <Button size="lg" color="primary" onPress={saveData}>
           {saveLoading?<Spinner/>: "Save Board"}
        </Button>
    </div>
    </>
    );
};

export default Canvas;