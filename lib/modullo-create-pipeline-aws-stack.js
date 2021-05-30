const { Stack, SecretValue } = require('@aws-cdk/core');

const { CdkPipeline, SimpleSynthAction } = require('@aws-cdk/pipelines');

const codepipeline = require('@aws-cdk/aws-codepipeline');
const codepipeline_actions = require('@aws-cdk/aws-codepipeline-actions');

const path = require("path");
const yaml = require("js-yaml");
const utilities = require(path.join(__dirname, "../utilities.js")); // Modullo Utilities

class ModulloCreatePipelineAwsStack extends Stack {
  /**
   *
   * @param {cdk.Construct} scope
   * @param {string} id
   * @param {cdk.StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);

    // The code that defines your stack goes here

    let modulloParamsFile = path.join(__dirname,`../modullo-params.yaml`);
    const params = utilities.readFile("yaml",modulloParamsFile);

    const sourceArtifact = new codepipeline.Artifact();
    const cloudAssemblyArtifact = new codepipeline.Artifact();

    const source_token = params["pipeline-source-github-token"];

    const pipeline = new CdkPipeline(this, 'Pipeline', {
      pipelineName: params["pipeline-name"],
      cloudAssemblyArtifact,

      sourceAction: new codepipeline_actions.GitHubSourceAction({
        actionName: 'GitHub',
        output: sourceArtifact,
        oauthToken: SecretValue.secretsManager(source_token),
        trigger: codepipeline_actions.GitHubTrigger.POLL,
        // Replace these with your actual GitHub project info
        owner: params["pipeline-source-github-owner"],
        repo: params["pipeline-source-github-repo"],
        branch: params["pipeline-source-github-branch"]
      }),

      synthAction: SimpleSynthAction.standardNpmSynth({
        sourceArtifact,
        cloudAssemblyArtifact,
        installCommand: params["pipeline-install-command"],

        // Use this if you need a build step (if you're not using ts-node
        // or if you have TypeScript Lambdas that need to be compiled).
        buildCommand: params["pipeline-build-command"]
      })
    });



  }
}

module.exports = { ModulloCreatePipelineAwsStack }
