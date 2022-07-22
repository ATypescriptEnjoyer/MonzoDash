-- CreateTable

CREATE TABLE
    "Settings" (
        "name" TEXT NOT NULL,
        "value" TEXT NOT NULL
    );

-- CreateIndex

CREATE UNIQUE INDEX "Settings_name_key" ON "Settings"("name");