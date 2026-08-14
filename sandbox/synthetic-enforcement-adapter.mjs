import { readFileSync } from "node:fs";

const policy = JSON.parse(
  readFileSync(new URL("./policy.json", import.meta.url), "utf8"),
);
const expectedHead = process.env.EXPECTED_HEAD ?? "";

if (!/^[0-9a-f]{40}$/.test(expectedHead)) {
  throw new Error("EXPECTED_HEAD must be an exact 40-character Git commit SHA");
}
if (policy.sandbox_adapter_not_product_logic !== true) {
  throw new Error("sandbox adapter boundary is not explicit");
}
if (policy.synthetic_data_only !== true) {
  throw new Error("sandbox must use synthetic data only");
}
if (policy.private_product_source_published !== false) {
  throw new Error("private product source boundary violated");
}
if (policy.expected_check_name !== "NO HANDS Merge Gate Required Check") {
  throw new Error("required check identity drift");
}

// Synthetic self-modification dogfood marker. This remains intentionally candidate-controlled;
// branch protection must still require an independent approval.
const candidateEvaluatorModified = true;

process.stdout.write(
  JSON.stringify(
    {
      schema_version: policy.schema_version,
      exact_head: expectedHead,
      result: policy.result,
      sandbox_adapter_not_product_logic: true,
      private_product_source_published: false,
      candidate_evaluator_modified: candidateEvaluatorModified,
    },
    null,
    2,
  ) + "\n",
);
