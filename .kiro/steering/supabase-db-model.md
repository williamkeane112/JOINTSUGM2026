## Table `users`

### Columns

| Name           | Type          | Constraints     |
| -------------- | ------------- | --------------- |
| `id`           | `uuid`        | Primary         |
| `email`        | `varchar`     | Nullable Unique |
| `full_name`    | `varchar`     |                 |
| `username`     | `varchar`     |                 |
| `phone_number` | `varchar`     | Nullable        |
| `role`         | `text`        |                 |
| `created_at`   | `timestamptz` |                 |
| `updated_at`   | `timestamptz` |                 |

## Table `categories`

### Columns

| Name           | Type          | Constraints      |
| -------------- | ------------- | ---------------- |
| `id`           | `int8`        | Primary Identity |
| `name`         | `text`        | Unique           |
| `slug`         | `text`        | Unique           |
| `description`  | `text`        | Nullable         |
| `icon`         | `text`        | Nullable         |
| `is_published` | `bool`        |                  |
| `created_at`   | `timestamptz` |                  |
| `updated_at`   | `timestamptz` |                  |

## Table `topics`

### Columns

| Name               | Type          | Constraints      |
| ------------------ | ------------- | ---------------- |
| `id`               | `int8`        | Primary Identity |
| `category_id`      | `int8`        | Nullable         |
| `name`             | `text`        |                  |
| `slug`             | `text`        | Unique           |
| `description`      | `text`        | Nullable         |
| `subject`          | `text`        |                  |
| `difficulty_level` | `text`        |                  |
| `order_sequence`   | `int4`        |                  |
| `source_type`      | `text`        |                  |
| `created_by`       | `uuid`        | Nullable         |
| `is_published`     | `bool`        |                  |
| `created_at`       | `timestamptz` |                  |
| `updated_at`       | `timestamptz` |                  |

## Table `learning_goals`

### Columns

| Name              | Type          | Constraints |
| ----------------- | ------------- | ----------- |
| `id`              | `uuid`        | Primary     |
| `user_id`         | `uuid`        |             |
| `topic_id`        | `int8`        | Nullable    |
| `requested_topic` | `text`        |             |
| `description`     | `text`        | Nullable    |
| `target_level`    | `text`        |             |
| `target_outcome`  | `text`        | Nullable    |
| `status`          | `text`        |             |
| `error_message`   | `text`        | Nullable    |
| `created_at`      | `timestamptz` |             |
| `updated_at`      | `timestamptz` |             |

## Table `learning_paths`

### Columns

| Name                 | Type          | Constraints |
| -------------------- | ------------- | ----------- |
| `id`                 | `uuid`        | Primary     |
| `goal_id`            | `uuid`        |             |
| `user_id`            | `uuid`        |             |
| `title`              | `text`        |             |
| `description`        | `text`        | Nullable    |
| `difficulty_level`   | `text`        |             |
| `estimated_hours`    | `numeric`     | Nullable    |
| `generation_version` | `int4`        |             |
| `status`             | `text`        |             |
| `created_at`         | `timestamptz` |             |
| `updated_at`         | `timestamptz` |             |

## Table `materials`

### Columns

| Name                | Type          | Constraints |
| ------------------- | ------------- | ----------- |
| `id`                | `uuid`        | Primary     |
| `topic_id`          | `int8`        | Nullable    |
| `title`             | `text`        |             |
| `description`       | `text`        | Nullable    |
| `content`           | `text`        | Nullable    |
| `material_type`     | `text`        |             |
| `source_url`        | `text`        | Nullable    |
| `difficulty_level`  | `text`        |             |
| `estimated_minutes` | `int4`        |             |
| `is_published`      | `bool`        |             |
| `created_by`        | `uuid`        | Nullable    |
| `created_at`        | `timestamptz` |             |
| `updated_at`        | `timestamptz` |             |

## Table `learning_path_steps`

### Columns

| Name                    | Type          | Constraints |
| ----------------------- | ------------- | ----------- |
| `id`                    | `uuid`        | Primary     |
| `learning_path_id`      | `uuid`        |             |
| `material_id`           | `uuid`        | Nullable    |
| `title`                 | `text`        |             |
| `description`           | `text`        | Nullable    |
| `learning_objectives`   | `jsonb`       |             |
| `prerequisite_step_ids` | `_uuid`       |             |
| `order_sequence`        | `int4`        |             |
| `estimated_minutes`     | `int4`        |             |
| `status`                | `text`        |             |
| `created_at`            | `timestamptz` |             |
| `updated_at`            | `timestamptz` |             |

## Table `quiz_questions`

### Columns

| Name               | Type          | Constraints |
| ------------------ | ------------- | ----------- |
| `id`               | `uuid`        | Primary     |
| `material_id`      | `uuid`        | Nullable    |
| `step_id`          | `uuid`        | Nullable    |
| `question`         | `text`        |             |
| `question_type`    | `text`        |             |
| `options`          | `jsonb`       |             |
| `correct_answer`   | `jsonb`       | Nullable    |
| `explanation`      | `text`        | Nullable    |
| `skill_key`        | `text`        |             |
| `difficulty_level` | `text`        |             |
| `is_published`     | `bool`        |             |
| `created_at`       | `timestamptz` |             |
| `updated_at`       | `timestamptz` |             |

## Table `quiz_attempts`

### Columns

| Name               | Type          | Constraints |
| ------------------ | ------------- | ----------- |
| `id`               | `uuid`        | Primary     |
| `user_id`          | `uuid`        |             |
| `question_id`      | `uuid`        |             |
| `learning_path_id` | `uuid`        | Nullable    |
| `answer`           | `jsonb`       | Nullable    |
| `is_correct`       | `bool`        |             |
| `response_time_ms` | `int4`        | Nullable    |
| `attempted_at`     | `timestamptz` |             |

## Table `student_mastery`

### Columns

| Name               | Type          | Constraints |
| ------------------ | ------------- | ----------- |
| `id`               | `uuid`        | Primary     |
| `user_id`          | `uuid`        |             |
| `skill_key`        | `text`        |             |
| `p_known`          | `float8`      |             |
| `attempts`         | `int4`        |             |
| `correct_attempts` | `int4`        |             |
| `last_assessed_at` | `timestamptz` | Nullable    |
| `updated_at`       | `timestamptz` |             |

## Table `step_progress`

### Columns

| Name               | Type          | Constraints |
| ------------------ | ------------- | ----------- |
| `id`               | `uuid`        | Primary     |
| `user_id`          | `uuid`        |             |
| `step_id`          | `uuid`        |             |
| `status`           | `text`        |             |
| `progress_percent` | `int4`        |             |
| `started_at`       | `timestamptz` | Nullable    |
| `completed_at`     | `timestamptz` | Nullable    |
| `updated_at`       | `timestamptz` |             |

## Table `ai_usage_events`

### Columns

| Name            | Type          | Constraints |
| --------------- | ------------- | ----------- |
| `id`            | `uuid`        | Primary     |
| `user_id`       | `uuid`        |             |
| `function_name` | `text`        |             |
| `model_name`    | `text`        | Nullable    |
| `input_tokens`  | `int4`        |             |
| `output_tokens` | `int4`        |             |
| `status`        | `text`        |             |
| `created_at`    | `timestamptz` |             |

## Table `topic_requests`

### Columns

| Name                 | Type          | Constraints |
| -------------------- | ------------- | ----------- |
| `id`                 | `uuid`        | Primary     |
| `user_id`            | `uuid`        |             |
| `requested_topic`    | `text`        |             |
| `suggested_category` | `text`        | Nullable    |
| `target_outcome`     | `text`        | Nullable    |
| `description`        | `text`        | Nullable    |
| `target_level`       | `text`        |             |
| `status`             | `text`        |             |
| `admin_notes`        | `text`        | Nullable    |
| `reviewed_by`        | `uuid`        | Nullable    |
| `reviewed_at`        | `timestamptz` | Nullable    |
| `created_at`         | `timestamptz` |             |
| `updated_at`         | `timestamptz` |             |

## Table `diagnostic_assessments`

### Columns

| Name               | Type          | Constraints |
| ------------------ | ------------- | ----------- |
| `id`               | `uuid`        | Primary     |
| `user_id`          | `uuid`        |             |
| `learning_goal_id` | `uuid`        |             |
| `questions`        | `jsonb`       |             |
| `answers`          | `jsonb`       |             |
| `score`            | `int4`        | Nullable    |
| `total_questions`  | `int4`        |             |
| `skill_analysis`   | `jsonb`       | Nullable    |
| `status`           | `text`        |             |
| `created_at`       | `timestamptz` |             |
| `completed_at`     | `timestamptz` | Nullable    |

## Table `diagnostic_answer_keys`

### Columns

| Name            | Type          | Constraints |
| --------------- | ------------- | ----------- |
| `assessment_id` | `uuid`        | Primary     |
| `answer_key`    | `jsonb`       |             |
| `explanations`  | `jsonb`       |             |
| `created_at`    | `timestamptz` |             |

## RLS Policies

### `users`

| Policy                         | Command | Roles         | Action     | USING                                | WITH CHECK                           |
| ------------------------------ | ------- | ------------- | ---------- | ------------------------------------ | ------------------------------------ |
| `Users can update own profile` | UPDATE  | authenticated | PERMISSIVE | `(( SELECT auth.uid() AS uid) = id)` | `(( SELECT auth.uid() AS uid) = id)` |
| `Users can view own profile`   | SELECT  | authenticated | PERMISSIVE | `(( SELECT auth.uid() AS uid) = id)` | —                                    |

### `categories`

| Policy                                | Command | Roles         | Action     | USING                   | WITH CHECK |
| ------------------------------------- | ------- | ------------- | ---------- | ----------------------- | ---------- |
| `skillpath_categories_read_published` | SELECT  | authenticated | PERMISSIVE | `(is_published = true)` | —          |

### `topics`

| Policy                            | Command | Roles         | Action     | USING                   | WITH CHECK |
| --------------------------------- | ------- | ------------- | ---------- | ----------------------- | ---------- |
| `skillpath_topics_read_published` | SELECT  | authenticated | PERMISSIVE | `(is_published = true)` | —          |

### `learning_goals`

| Policy                       | Command | Roles         | Action     | USING                                     | WITH CHECK                                |
| ---------------------------- | ------- | ------------- | ---------- | ----------------------------------------- | ----------------------------------------- |
| `skillpath_goals_insert_own` | INSERT  | authenticated | PERMISSIVE | —                                         | `(( SELECT auth.uid() AS uid) = user_id)` |
| `skillpath_goals_select_own` | SELECT  | authenticated | PERMISSIVE | `(( SELECT auth.uid() AS uid) = user_id)` | —                                         |
| `skillpath_goals_update_own` | UPDATE  | authenticated | PERMISSIVE | `(( SELECT auth.uid() AS uid) = user_id)` | `(( SELECT auth.uid() AS uid) = user_id)` |

### `learning_paths`

| Policy                       | Command | Roles         | Action     | USING                                     | WITH CHECK |
| ---------------------------- | ------- | ------------- | ---------- | ----------------------------------------- | ---------- |
| `skillpath_paths_select_own` | SELECT  | authenticated | PERMISSIVE | `(( SELECT auth.uid() AS uid) = user_id)` | —          |

### `materials`

| Policy                               | Command | Roles         | Action     | USING                   | WITH CHECK |
| ------------------------------------ | ------- | ------------- | ---------- | ----------------------- | ---------- |
| `skillpath_materials_read_published` | SELECT  | authenticated | PERMISSIVE | `(is_published = true)` | —          |

### `learning_path_steps`

| Policy                            | Command | Roles         | Action     | USING                                                                                                                                                    | WITH CHECK |
| --------------------------------- | ------- | ------------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| `skillpath_steps_select_own_path` | SELECT  | authenticated | PERMISSIVE | `(EXISTS ( SELECT 1    FROM learning_paths lp   WHERE ((lp.id = learning_path_steps.learning_path_id) AND (lp.user_id = ( SELECT auth.uid() AS uid)))))` | —          |

### `quiz_questions`

| Policy                               | Command | Roles         | Action     | USING                   | WITH CHECK |
| ------------------------------------ | ------- | ------------- | ---------- | ----------------------- | ---------- |
| `skillpath_questions_read_published` | SELECT  | authenticated | PERMISSIVE | `(is_published = true)` | —          |

### `quiz_attempts`

| Policy                          | Command | Roles         | Action     | USING                                     | WITH CHECK                                |
| ------------------------------- | ------- | ------------- | ---------- | ----------------------------------------- | ----------------------------------------- |
| `skillpath_attempts_insert_own` | INSERT  | authenticated | PERMISSIVE | —                                         | `(( SELECT auth.uid() AS uid) = user_id)` |
| `skillpath_attempts_select_own` | SELECT  | authenticated | PERMISSIVE | `(( SELECT auth.uid() AS uid) = user_id)` | —                                         |

### `student_mastery`

| Policy                         | Command | Roles         | Action     | USING                                     | WITH CHECK |
| ------------------------------ | ------- | ------------- | ---------- | ----------------------------------------- | ---------- |
| `skillpath_mastery_select_own` | SELECT  | authenticated | PERMISSIVE | `(( SELECT auth.uid() AS uid) = user_id)` | —          |

### `step_progress`

| Policy                          | Command | Roles         | Action     | USING                                     | WITH CHECK                                |
| ------------------------------- | ------- | ------------- | ---------- | ----------------------------------------- | ----------------------------------------- |
| `skillpath_progress_insert_own` | INSERT  | authenticated | PERMISSIVE | —                                         | `(( SELECT auth.uid() AS uid) = user_id)` |
| `skillpath_progress_select_own` | SELECT  | authenticated | PERMISSIVE | `(( SELECT auth.uid() AS uid) = user_id)` | —                                         |
| `skillpath_progress_update_own` | UPDATE  | authenticated | PERMISSIVE | `(( SELECT auth.uid() AS uid) = user_id)` | `(( SELECT auth.uid() AS uid) = user_id)` |

### `ai_usage_events`

| Policy                          | Command | Roles         | Action     | USING                                     | WITH CHECK |
| ------------------------------- | ------- | ------------- | ---------- | ----------------------------------------- | ---------- |
| `skillpath_ai_usage_select_own` | SELECT  | authenticated | PERMISSIVE | `(( SELECT auth.uid() AS uid) = user_id)` | —          |

### `topic_requests`

| Policy                                | Command | Roles         | Action     | USING                    | WITH CHECK               |
| ------------------------------------- | ------- | ------------- | ---------- | ------------------------ | ------------------------ |
| `Users can create own topic requests` | INSERT  | authenticated | PERMISSIVE | —                        | `(auth.uid() = user_id)` |
| `Users can view own topic requests`   | SELECT  | authenticated | PERMISSIVE | `(auth.uid() = user_id)` | —                        |

### `diagnostic_assessments`

| Policy                                      | Command | Roles         | Action     | USING                    | WITH CHECK |
| ------------------------------------------- | ------- | ------------- | ---------- | ------------------------ | ---------- |
| `Users can view own diagnostic assessments` | SELECT  | authenticated | PERMISSIVE | `(auth.uid() = user_id)` | —          |
