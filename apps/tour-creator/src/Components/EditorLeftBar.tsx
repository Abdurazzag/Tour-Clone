import { useState, useEffect } from "react";
import type { TourNode } from "../script/TourDataStruct";
import styles from "../styles/EditorLeftBar.module.css";
import { isEditedSincePublish, getSavedTourJson, tourReplacer } from "../script/storage";

type EditorLeftBarProps = {
    topButtonLabel: string;
    onTopButton?: () => void;
    name: string;
    admin: string;
    onSave?: () => void | Promise<void>;
    saveLabel?: string;
    onView?: () => void;
    viewLabel?: string;
    viewDisabled?: boolean;
    onPublish?: () => void | Promise<void>;
    publishLabel?: string;
    currentTour?: TourNode;
    tourId?: string;
};

function EditorLeftBar({
    topButtonLabel,
    onTopButton,
    name,
    admin,
    onSave,
    saveLabel = "Save Tour",
    onView,
    viewLabel = "View Tour",
    viewDisabled = false,
    onPublish,
    publishLabel = "Publish Tour",
    currentTour,
    tourId
}: EditorLeftBarProps) {

    const [editedSincePublish, setEditedSincePublish] = useState(false);
    const [unsavedChanges, setUnsavedChanges] = useState(false);
    const [update, setUpdate] = useState(0);

    const handleSave = async () => {
        if (onSave) await onSave();
        setUpdate(update + 1);
    };

    const handlePublish = async () => {
        if (onPublish) await onPublish();
        setUpdate(update + 1);
    };

    useEffect(() => {
        if (!tourId) {
            setEditedSincePublish(false);
            setUnsavedChanges(false);
            return;
        }
        isEditedSincePublish(tourId)
            .then(setEditedSincePublish)
            .catch(() => setEditedSincePublish(false));

        if (currentTour) {
            getSavedTourJson(tourId).then((savedJson) => {
                if (!savedJson) {
                    setUnsavedChanges(false);
                    return;
                }
                const currentJson = JSON.stringify(currentTour, tourReplacer);
                setUnsavedChanges(currentJson !== savedJson);
            }).catch(() => setUnsavedChanges(false));
        }
    }, [tourId, currentTour, update]);

    return (
        <aside className={styles.sidebar}>
            <div className={styles.sidebarBox}>
                <button onClick={onTopButton} className={styles.topBtn}>
                    {topButtonLabel}
                </button>
            </div>

            <div className={styles.sidebarMetaRow}>
                <div className={styles.sidebarMetaCell}>
                    <div className={styles.sidebarMetaLabel}>Name</div>
                    <div className={styles.sidebarMetaValue}>{name}</div>
                </div>
                <div className={styles.sidebarMetaCell}>
                    <div className={styles.sidebarMetaLabel}>Admin</div>
                    <div className={styles.sidebarMetaValue}>{admin}</div>
                </div>
            </div>

            {onSave ? (
                <div className={styles.sidebarBox}>
                    <button onClick={handleSave} className={styles.saveBtn}>
                        {saveLabel}
                    </button>
                </div>
            ) : null}

            {onView ? (
                <div className={styles.sidebarBox}>
                    <button
                        onClick={onView}
                        className={styles.viewBtn}
                        disabled={viewDisabled}
                    >
                        {viewLabel}
                    </button>
                </div>
            ) : null}

            {onPublish ? (
                <div className={styles.sidebarBox}>
                    <button
                        onClick={handlePublish}
                        className={styles.publishBtn}
                    >
                        {publishLabel}
                    </button>
                </div>
            ) : null}
            {currentTour ? (
                <div className={styles.checklistBox}>
                    <h2>Checklist</h2>
                    <h3 style={{color : "lightgray", fontSize : "0.75rem"}}>Tour may not function as expected if all items are not completed</h3>
                    <ul>
                        <li style={unsavedChanges ? { color: "red" } : undefined}> {unsavedChanges ? "❌" : "✅"} Tour Saved</li>
                        <li> {currentTour.startNode ? "✅" : "❌"} Upload Starting Panorama Image*</li>
                        <li> {currentTour.mainPage.slideShowImages && currentTour.mainPage.slideShowImages.length > 0 ? "✅" : "❌"} Upload Slideshow Image</li>
                        <li> {currentTour.mainPage.introduction ? "✅" : "❌"} Add a landing page title</li>
                        <li> {currentTour.mainPage.description ? "✅" : "❌"} Add a landing page description</li>
                        <li> {currentTour.mainPage.logo ? "✅" : "❌"} Upload a logo</li>
                        {publishLabel ? (
                            <li> {publishLabel === "Publish Tour" ? "❌" : editedSincePublish ? "❌" : "✅"} Up to date (not edited since publish)</li>
                        ) : null}
                    </ul>
                </div>
            ) : null}
        </aside>
    );
}

export default EditorLeftBar;