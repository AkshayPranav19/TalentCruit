
import sys, json, signal


def timeout_handler(signum, frame):
    raise TimeoutError("Code execution timed out")

if hasattr(signal, 'SIGALRM'):
    signal.signal(signal.SIGALRM, timeout_handler)
    signal.alarm(8) 


class ListNode:
    def __init__(self, val=0, nxt=None):
        self.val = val
        self.next = nxt

def build_list(arr):
    if not arr:
        return None
    head = ListNode(arr[0])
    cur = head
    for v in arr[1:]:
        cur.next = ListNode(v)
        cur = cur.next
    return head

def to_pylist(node):
    out = []
    while node:
        out.append(node.val)
        node = node.next
    return out

def main():
    try:
       
        test_cases = {
            "1": [
                { "input": { "nums": [2, 7, 11, 15], "target": 9 }, "expected": [0, 1] },
                { "input": { "nums": [3, 2, 4], "target": 6 }, "expected": [1, 2] },
                { "input": { "nums": [3, 3], "target": 6 }, "expected": [0, 1] },
                { "input": { "nums": [-1, -2, -3, -4, -5], "target": -8 }, "expected": [2, 4] },
                { "input": { "nums": [1, 2, 3, 4, 5], "target": 5 }, "expected": [1, 2] },
                { "input": { "nums": [5, 75, 25], "target": 100 }, "expected": [1, 2] },
                { "input": { "nums": [0, 4, 3, 0], "target": 0 }, "expected": [0, 3] },
                { "input": { "nums": [-3, 4, 3, 90], "target": 0 }, "expected": [0, 2] },
                { "input": { "nums": [1, 1, 1, 1], "target": 2 }, "expected": [0, 1] },
                { "input": { "nums": [2, 5, 5, 11], "target": 10 }, "expected": [1, 2] },
                { "input": { "nums": [1, 5, 3, 2], "target": 8 }, "expected": [1, 2] },
                { "input": { "nums": [2, 5, -2, -4, 7], "target": 0 }, "expected": [0, 2] },
                { "input": { "nums": [1000000, 500000, -500000, 2000000], "target": 0 }, "expected": [1, 2] },
                { "input": { "nums": [1, 0, -1], "target": 0 }, "expected": [0, 2] },
                { "input": { "nums": [14, 11, 2, 7], "target": 9 }, "expected": [2, 3] },
                { "input": { "nums": [6, 2, 95, 4], "target": 10 }, "expected": [0, 3] },
                { "input": { "nums": [3, 3, 4, 3], "target": 6 }, "expected": [0, 1] },
                { "input": { "nums": [1, 2], "target": 3 }, "expected": [0, 1] },
                { "input": { "nums": [5, 4, 3, 2, 1], "target": 8 }, "expected": [0, 2] },
                { "input": { "nums": [10, -5, 15, 20], "target": 5 }, "expected": [0, 1] }
            ],
            

            "2": [
                { "input": { "l1": [2, 4, 3], "l2": [5, 6, 4] }, "expected": [7, 0, 8] },
                { "input": { "l1": [0], "l2": [0] }, "expected": [0] },
                { "input": { "l1": [9, 9, 9, 9, 9, 9, 9], "l2": [9, 9, 9, 9] }, "expected": [8, 9, 9, 9, 0, 0, 0, 1] },
                { "input": { "l1": [1], "l2": [9, 9] }, "expected": [0, 0, 1] },
                { "input": { "l1": [5], "l2": [5] }, "expected": [0, 1] },
                { "input": { "l1": [1, 2, 3], "l2": [4, 5, 6] }, "expected": [5, 7, 9] },
                { "input": { "l1": [9], "l2": [1] }, "expected": [0, 1] },
                { "input": { "l1": [1, 8], "l2": [0] }, "expected": [1, 8] },
                { "input": { "l1": [2, 7], "l2": [5, 6] }, "expected": [7, 3, 1] },
                { "input": { "l1": [1, 2], "l2": [9, 8, 7] }, "expected": [0, 1, 8] },
                { "input": { "l1": [9, 9], "l2": [1] }, "expected": [0, 0, 1] },
                { "input": { "l1": [0], "l2": [5, 6, 4] }, "expected": [5, 6, 4] },
                { "input": { "l1": [7, 3, 2], "l2": [8, 6, 7] }, "expected": [5, 0, 0, 1] },
                { "input": { "l1": [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], "l2": [5, 6, 4] }, "expected": [6, 6, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1] },
                { "input": { "l1": [3, 7], "l2": [9, 2] }, "expected": [2, 0, 1] },
                { "input": { "l1": [6, 4, 5], "l2": [7, 3, 2] }, "expected": [3, 8, 7] },
                { "input": { "l1": [5, 2, 1], "l2": [6, 8, 4] }, "expected": [1, 1, 6] },
                { "input": { "l1": [1, 1, 1, 1, 1], "l2": [2, 2, 2, 2, 2] }, "expected": [3, 3, 3, 3, 3] },
                { "input": { "l1": [9, 8, 7, 6, 5], "l2": [1, 2, 3, 4, 5] }, "expected": [0, 1, 1, 1, 1, 1] },
                { "input": { "l1": [4, 5, 6], "l2": [6, 5, 4] }, "expected": [0, 1, 1, 1] }
            ],

            "3": [
                { "input": { "s": "abcabcbb" }, "expected": 3 },
                { "input": { "s": "bbbbb" }, "expected": 1 },
                { "input": { "s": "pwwkew" }, "expected": 3 },
                { "input": { "s": "" }, "expected": 0 },
                { "input": { "s": "a" }, "expected": 1 },
                { "input": { "s": "abc" }, "expected": 3 },
                { "input": { "s": "abcdef" }, "expected": 6 },
                { "input": { "s": "aab" }, "expected": 2 },
                { "input": { "s": "dvdf" }, "expected": 3 },
                { "input": { "s": "anviaj" }, "expected": 5 },
                { "input": { "s": "abba" }, "expected": 2 },
                { "input": { "s": "tmmzuxt" }, "expected": 5 },
                { "input": { "s": "ohvhjdml" }, "expected": 6 },
                { "input": { "s": "wobgrovw" }, "expected": 6 },
                { "input": { "s": "abcabcdefg" }, "expected": 7 },
                { "input": { "s": "nfpdmpi" }, "expected": 5 },
                { "input": { "s": "abcdefghijklmnopqrstuvwxyz" }, "expected": 26 },
                { "input": { "s": "ckilbkd" }, "expected": 5 },
                { "input": { "s": "jbpnbwwd" }, "expected": 4 },
                { "input": { "s": "c" }, "expected": 1 }
            ],
            "4": [
                {"input": {"nums1": [1, 3], "nums2": [2]}, "expected": 2.0},
                {"input": {"nums1": [1, 2], "nums2": [3, 4]}, "expected": 2.5},
                {"input": {"nums1": [], "nums2": [1]}, "expected": 1.0},
                {"input": {"nums1": [2], "nums2": []}, "expected": 2.0},
                {"input": {"nums1": [], "nums2": [1, 2]}, "expected": 1.5},
                {"input": {"nums1": [1, 2], "nums2": []}, "expected": 1.5},
                {"input": {"nums1": [1], "nums2": [2]}, "expected": 1.5},
                {"input": {"nums1": [5], "nums2": [1]}, "expected": 3.0},
                {"input": {"nums1": [1, 3, 5], "nums2": [2, 4, 6]}, "expected": 3.5},
                {"input": {"nums1": [1, 2, 3], "nums2": [4, 5, 6]}, "expected": 3.5},
                {"input": {"nums1": [1], "nums2": [2, 3, 4]}, "expected": 2.5},
                {"input": {"nums1": [1, 2], "nums2": [3, 4, 5, 6]}, "expected": 3.5},
                {"input": {"nums1": [1, 2, 3, 4, 5], "nums2": [6]}, "expected": 3.5},
                {"input": {"nums1": [1, 1], "nums2": [1, 2]}, "expected": 1.0},
                {"input": {"nums1": [1, 2, 2], "nums2": [2, 3, 4]}, "expected": 2.0},
                {"input": {"nums1": [-3, -1], "nums2": [-2, 0]}, "expected": -1.5},
                {"input": {"nums1": [-5, -3, -1], "nums2": [-4, -2]}, "expected": -3.0},
                {"input": {"nums1": [-1, 0], "nums2": [1, 2]}, "expected": 0.5},
                {"input": {"nums1": [-2, -1, 3], "nums2": [1, 2]}, "expected": 1.0},
                {"input": {"nums1": [1, 3, 5, 7, 9], "nums2": [2, 4, 6, 8]}, "expected": 5.0}
            ]
        }
        
      
        payload = json.load(sys.stdin)
        qid     = str(payload.get("questionId",""))
        code    = payload.get("code","")
        
        if not qid or not code:
            print(json.dumps({"error":"questionId and code are required"}))
            sys.exit(1)

        cases = test_cases.get(qid)
        if cases is None:
            print(json.dumps({"error":f"no tests for questionId={qid}"}))
            sys.exit(1)

        
        user_ns = {"ListNode": ListNode}
        try:
            exec(code, user_ns)
        except Exception as e:
            print(json.dumps({"error":"code failed to compile","details":str(e)}))
            sys.exit(1)

        
        if qid == "1":
            fn = user_ns.get("two_sum")
        elif qid == "2":
            fn = user_ns.get("add_two_numbers")
        elif qid == "3":
            fn = user_ns.get("length_of_longest_substring")
        elif qid == "4":
            fn = user_ns.get("find_median_sorted_arrays")
        else:
            print(json.dumps({"error":f"unsupported questionId={qid}"}))
            sys.exit(1)

        if not callable(fn):
            print(json.dumps({"error":f"required function for qid={qid} not defined"}))
            sys.exit(1)

        
        results = []
        passed  = 0
        for tc in cases:
            inp = tc["input"]
            exp = tc["expected"]
            try:
                if qid == "1":
                    actual = fn(inp["nums"], inp["target"])
                elif qid == "2":
                    h1 = build_list(inp["l1"])
                    h2 = build_list(inp["l2"])
                    out_head = fn(h1, h2)
                    actual = to_pylist(out_head)
                elif qid == "3":
                    actual = fn(inp["s"])
                else:  
                    actual = fn(inp["nums1"], inp["nums2"])

                ok = (actual == exp)
            except Exception as e:
                actual = str(e)
                ok = False

            if ok:
                passed += 1
            results.append({"input":inp, "expected":exp, "actual":actual, "passed":ok})

        
        summary = {
            "total":  len(cases),
            "passed": passed,
            "failed": len(cases) - passed,
            "results": results
        }
        print(json.dumps(summary))
        
    except Exception as e:
        print(json.dumps({"error": "Python runner failed", "details": str(e)}))
        sys.exit(1)

if __name__ == "__main__":
    main()