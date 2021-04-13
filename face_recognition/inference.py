from paddle.fluid.core import AnalysisConfig, PaddleTensor
from paddle.fluid.core import create_paddle_predictor

class AnalysisModel():
    def __init__(self, model_flie, params_file, use_feed_fetch_ops, specify_input_names):
        self.config = self.set_config(model_flie, params_file, use_feed_fetch_ops, specify_input_names)
        self.predictor = create_paddle_predictor(self.config)

    def set_config(self, model_flie, params_file, use_feed_fetch_ops, specify_input_names):
        config = AnalysisConfig(model_flie, params_file)
        config.disable_gpu()
        config.enable_mkldnn()
        config.disable_glog_info()
        config.switch_ir_optim(True)
        config.switch_use_feed_fetch_ops(use_feed_fetch_ops)
        config.switch_specify_input_names(specify_input_names)
        return config

    def predict_val(self, inputs):
        input_names = self.predictor.get_input_names()
        input_tensor = self.predictor.get_input_tensor(input_names[0])
        input_tensor.copy_from_cpu(inputs)
        self.predictor.zero_copy_run()
        output_names = self.predictor.get_output_names()
        output_tensor = self.predictor.get_output_tensor(output_names[0])
        output_data = output_tensor.copy_to_cpu()
        return output_data

    def predict_det(self, inputs):
        inputs = PaddleTensor(inputs.copy())
        result = self.predictor.run([inputs])
        output_data = result[0].as_ndarray()
        return output_data
